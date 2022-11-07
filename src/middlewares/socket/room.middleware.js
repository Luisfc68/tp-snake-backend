const { errors } = require('../../constants/errorMessages');
const { getConnectionParam } = require('../../utils/socket.utils');
const roomHandler = require('../../socket/game/RoomHandler');
const playerService = require('../../services/players.service');
const { serverEvents } = require('../../constants/events');

const joinRoomMiddleware = function (socket, next) {
    const gameId = getConnectionParam(socket, 'gameId');
    const playerId = getConnectionParam(socket, 'playerId');

    const game = roomHandler.getGame(gameId);
    if (!game) {
        next({ error: errors.game.gameNotFound });
        return;
    }

    playerService.findPlayerById(playerId)
        .then(player => {
            if (player) {
                game.emit(serverEvents.PLAYER_JOIN, player);
                return game.addPlayer(socket);
            } else {
                throw new Error(errors.player.playerNotFound);
            }
        })
        .then(() => {
            socket.join(gameId)
            next();
        })
        .catch(next);
}

module.exports = {
    joinRoomMiddleware
}