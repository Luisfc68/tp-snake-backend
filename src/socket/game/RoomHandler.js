const { SnakeGame } = require('./SnakeGame');

class RoomHandler {

    #rooms
    #ioServer

    constructor() {
        this.#rooms = new Map();
    }

    initRoomHandler(socketServer) {
        if (!this.#ioServer) {
            this.#ioServer = socketServer;
        } else {
            throw new Error('Room handler already initialized');
        }
    }

    createGame(roomId) {
        if (this.#ioServer) {
            const game = new SnakeGame({ roomId, ioServer: this.#ioServer });
            this.#rooms.set(roomId, game);
        } else {
            throw new Error('Room handler should be initialized');
        }
    }

    getGame(roomId) {
        if (this.#ioServer) {
            return this.#rooms.get(roomId);
        } else {
            throw new Error('Room handler should be initialized');
        }
    }

}

module.exports = new RoomHandler();