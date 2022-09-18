const { Server } = require("socket.io");

class SocketServer {

    #ioServer
    #events

    constructor({ httpServer, socketConfig }) {
        this.#ioServer = new Server(httpServer, socketConfig);
        this.#events = [];
        this.#ioServer.on('connection', (socket) => {
            this.#events.forEach(event => socket.on(event.name, event.handler));
        });
    }

    use(middleware) {
        this.#ioServer.use(middleware);
    }

    registerEvent(event) {
        this.#events.push(event);
    }

}

module.exports = {
    SocketServer
}