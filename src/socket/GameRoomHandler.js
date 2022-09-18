class GameRoomHandler {

    #runningGames

    constructor() {
        this.#runningGames = new Map();
        // todo borrar
        this.#runningGames.set('test', []);
    }

    registerGame(gameId) {
        if (this.#runningGames.has(gameId)) {
            return false;
        }
        this.#runningGames.set(gameId, []);
        return true;
    }

    unregisterGame(gameId) {
        return this.#runningGames.delete(gameId);
    }

    joinGame({ gameId, socketId }) {
        const game = this.#runningGames.get(gameId);
        if (game) {
            game.push(socketId);
            return true;
        } else {
            return false;
        }
    }

    leaveGame({ gameId, socketId }) {
        let game = this.#runningGames.get(gameId);
        if (!game) {
            return false;
        }
        const previousSize = game.length;
        game = game.filter(existingSocket => existingSocket === socketId);
        return game.length !== previousSize;
    }

}

module.exports = new GameRoomHandler();