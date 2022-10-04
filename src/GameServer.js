const { mongoose } = require('mongoose');
const logger = require('consola');
const { SocketServer } = require("./socket/SocketServer");
const { createServer } = require('http');
const roomHandler = require('./socket/game/RoomHandler');

class GameServer {

    #app
    #httpServer
    #mongoConfig
    #expressConfig
    #socketServer

    constructor({ expressApp, expressConfig, socketConfig, mongoConfig }) {
        this.#app = expressApp;
        this.#httpServer = createServer(this.#app);
        this.#mongoConfig = mongoConfig;
        this.#expressConfig = expressConfig;
        this.#socketServer = new SocketServer({ httpServer: this.#httpServer, socketConfig });
    }

    useOnAPI(middleware) {
        this.#app.use(middleware);
    }

    useOnSockets(middleware) {
        this.#socketServer.use(middleware);
    }

    registerEvent(event) {
        this.#socketServer.registerEvent(event);
    }

    run() {
        mongoose.connect(this.#mongoConfig.getDbUri(), (error) => {
            if(error) {
                logger.error(`Error connecting to database ${error}`);
                return;
            }
            logger.start(`Connected to database ${this.#mongoConfig.name}`);
            this.#httpServer.listen(this.#expressConfig.port, () => {
                roomHandler.initRoomHandler(this.#socketServer.ioServer);
                logger.start(`Server started on port ${this.#expressConfig.port}`);
            });
        });
    }
    

}

module.exports = {
    GameServer
}