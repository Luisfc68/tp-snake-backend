const { getConnectionParam } = require('../../utils/socket.utils');
const gameService = require('../../services/game.service');
const { errors } = require('../../constants/errorMessages');
const SocketError = require('../../errors/SocketError');
const {
    SPEED_UP_INTERVAL, MINIMUM_SPEED,
    INITIAL_SPEED, SPEED_REDUCTION, BOARD_SIZE
} = require('../../configs/game.config');
const logger = require('consola');
const { SnakeBody, MOVES } = require('./SnakeBody');
const { clientEvents } = require('../../constants/events');
const { mapValuesToArray } = require('../../utils/array.utils');
const { randomInt } = require('../../utils/math.utils');

class SnakeGame {

    #players;
    #roomId;
    #ioServer;
    #winner;

    #sendMovementSpeed;
    #currentMovementInterval;
    #speedUpInterval;
    #level
    #currentFood

    DEFAULT_START_POSITIONS = [
        { positions: [{ x: 0 , y: BOARD_SIZE - 1 }], movingDirection: MOVES.RIGHT },
        { positions: [{ x: 0 , y: 0 }], movingDirection: MOVES.UP },
        { positions: [{ x: BOARD_SIZE - 1, y: 0 }], movingDirection: MOVES.LEFT },
        { positions: [{ x: BOARD_SIZE - 1, y: BOARD_SIZE - 1 }], movingDirection: MOVES.DOWN }
    ];

    constructor({ roomId, ioServer }) {
        this.#players = new Map();
        this.#roomId = roomId;
        this.#ioServer = ioServer;
        this.#winner = null;
        this.#currentFood = null;
        this.#sendMovementSpeed = INITIAL_SPEED;
        this.#currentMovementInterval = null;
        this.#speedUpInterval = null;
        this.#level = 1;
    }

    getPlayer(playerId) {
        return this.#players.get(playerId);
    }

    addPlayer(socket) {
        const playerId = getConnectionParam(socket, 'playerId');
        if (!playerId) {
            throw new SocketError({ message: errors.game.gameNotFound });
        } else if (this.#players.size > 4) {
            throw new SocketError({ message: errors.game.gameFull });
        }
        return gameService.findByGameId(this.#roomId)
            .then(game => {
                if (game && game.status === 'WAITING') {
                    if (!game.players.includes(playerId)) {
                        game.players.push(playerId);
                    }
                    return game.save();
                } else {
                    throw new SocketError({ message: errors.game.gameNotFound });
                }
            })
            .then(() => {
                this.#players.set(playerId, {
                    socket,
                    confirmed: false,
                    snakeBody: new SnakeBody(),
                    playerId
                });
                return;
            });
    }

    removePlayer(socket) {
        const playerId = getConnectionParam(socket, 'playerId');
        if (!playerId) {
            return false;
        }
        return gameService.findByGameId(this.#roomId)
            .then(game => {
                if(!game) {
                    throw new SocketError({ message: errors.game.gameNotFound });
                }
                if (game.status === 'WAITING') {
                    game.players = game.players.filter(id => id.toString() !== playerId);
                }
                return gameService.saveGame(game);
            })
            .then(() => this.#players.delete(playerId));
    }

    confirmPlayer(socket) {
        const playerId = getConnectionParam(socket, 'playerId');
        if (!playerId) {
            return false;
        }
        const player = this.#players.get(playerId);
        if (!player) {
            return false;
        }
        player.confirmed = true;
        return true;
    }

    allPlayersConfirmed() {
        return mapValuesToArray(this.#players).every(player => player.confirmed);
    }

    init(owner) {
        return gameService.findByGameId(this.#roomId)
            .then(game => {
                if(!game) {
                    throw new SocketError({ message: errors.game.gameNotFound });
                } else if (game.owner.id !== owner) {
                    throw new SocketError({ message: errors.game.notPermission });
                }
                game.status = 'PLAYING';
                return gameService.saveGame(game);
            })
            .then(() => this.#doMatch());
    }

    emit(event, args) {
        this.#ioServer.to(this.#roomId).emit(event, args);
    }

    #doMatch() {
        mapValuesToArray(this.#players).forEach((player, index) => {
            player.snakeBody.positions = this.DEFAULT_START_POSITIONS[index].positions;
            player.snakeBody.movingDirection = this.DEFAULT_START_POSITIONS[index].movingDirection;
        });
        this.#speedUpInterval = setInterval(() => {
            if (this.#currentMovementInterval) {
                clearInterval(this.#currentMovementInterval);
            }
            this.#currentMovementInterval = this.#createMovementInterval();
            this.#speedUp();
            this.#level++;
        }, SPEED_UP_INTERVAL);
    }

    #createMovementInterval() {
        return setInterval(() => {
            const playersArray = mapValuesToArray(this.#players);
            playersArray.forEach(player => player.snakeBody.move());
            const movementsData = playersArray.map(player => {
                return {
                    player: player.playerId,
                    positions: player.snakeBody.positions
                }
            });
            this.emit(clientEvents.MOVEMENTS, movementsData);
            this.#checkEatenFood();
            this.#checkDeaths();
            this.#checkEnd();
        }, this.#sendMovementSpeed);
    }

    #speedUp() {
        if (this.#sendMovementSpeed !== MINIMUM_SPEED) {
            this.#sendMovementSpeed -= SPEED_REDUCTION;
        }
    }

    #checkEnd() {
        if (!this.#winner) {
            return;
        }
        clearInterval(this.#speedUpInterval);
        clearInterval(this.#currentMovementInterval);
        this.emit(clientEvents.FINISHED, this.#winner.playerId);
        gameService.findByGameId(this.#roomId)
            .then(game => {
                game.winner = this.#winner.playerId;
                game.status = 'FINISHED';
                game.maxReachedLevel = this.#level;

                return game.save();
            })
            .catch(e => logger.error(e.message));
    }

    #checkDeaths() {
        mapValuesToArray(this.#players).forEach(player => {
            if (player.snakeBody.isOutOfField() || player.snakeBody.isSelfCollided() || this.#checkCollisions(player)) {
                this.emit(clientEvents.DEATH, player.playerId);
                player.socket.disconnect();
                this.#players.delete(player.playerId);
            }
            if (this.#players.size === 0) {
                this.#winner = player;
            }
        });
    }

    #checkCollisions(player) {
        return mapValuesToArray(this.#players)
            .filter(otherPlayer => otherPlayer.playerId !== player.playerId)
            .some(otherPlayer => otherPlayer.snakeBody.positions
                .some(position => position.x === player.snakeBody.head.x && position.y === player.snakeBody.head.y)
            );
    }

    foodSpawn() {
        const x = randomInt(0, BOARD_SIZE);
        const y = randomInt(0, BOARD_SIZE);
        this.#currentFood = { x, y };
        this.emit(clientEvents.FOOD_SPAWN, this.#currentFood);
    }

    #checkEatenFood() {
        mapValuesToArray(this.#players)
            .filter(player => player.snakeBody.positions
                .some(position => position.x === this.#currentFood.x && position.y === this.#currentFood.y)
            )
            .forEach(player => {
               player.snakeBody.grow();
               this.emit(clientEvents.FOOD_EATEN, this.#currentFood);
               this.foodSpawn();
            });
    }
}

module.exports = {
    SnakeGame
}