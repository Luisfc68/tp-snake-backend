const { mongoose } = require('mongoose');
const logger = require('consola');
const { SocketServer } = require("../socket/SocketServer");
const { createServer } = require('http');
const roomHandler = require('../socket/game/RoomHandler');
const { MongoMemoryServer } = require("mongodb-memory-server");

class GameServer {

    #app
    #httpServer
    #expressConfig
    #socketServer

    constructor({ expressApp, expressConfig, socketConfig }) {
        this.#app = expressApp;
        this.#httpServer = createServer(this.#app);
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
    //No borrar las variables. Son necesarias para que ande.
        const uri=this.#httpServer
        const expressConfig=this.#expressConfig
        const socketServer=this.#socketServer
        MongoMemoryServer.create().then(database => {
           mongoose.connect(database.getUri(), (error) => {
               uri.listen(expressConfig.port, () => {
                   roomHandler.initRoomHandler(socketServer.ioServer);
                   logger.start(`Server started on port ${expressConfig.port}`);
               });
           });
        });
    }

    
    disconnect = async () => { 
        await this.#httpServer.close()
        await mongoose.connection.close()
        const socketServer = this.#socketServer
        socketServer.ioServer.close()
    }

    seeState = async () => {
        logger.info(mongoose.connection.readyState);
    }

}

module.exports = {
    GameServer
}