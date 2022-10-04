const { mongoose } = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const logger = require('consola');
const { SocketServer } = require("../socket/SocketServer");
const { createServer } = require('http');
const roomHandler = require('../socket/game/RoomHandler');
const { run } = require('jest');

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
    //No borrar las variables. Son necesarias para que ande.
        const mongoConfig=this.#mongoConfig
        const uri=this.#httpServer
        const expressConfig=this.#expressConfig
        const socketServer=this.#socketServer
        mockgoose.prepareStorage().then(function() {

            mongoose.connect(mongoConfig.getDbUri(), (error) => {
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
        await mockgoose.shutdown() 
        const socketServer = this.#socketServer
        socketServer.ioServer.close()
    }

    seeState = async () => { 
        console.log(mongoose.connection.readyState )

    }

    seeMongooseState = async () => { 
        console.log(mockgoose.helper.isMocked() )

    }

}

module.exports = {
    GameServer
}