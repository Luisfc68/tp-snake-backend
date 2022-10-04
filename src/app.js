const express = require('express');

const expressConfig = require('./configs/express.config');
const mongoConfig = require('./configs/mongo.config');
const socketConfig = require('./configs/socketio.config');

const { loggingMiddleware } = require('./middlewares/logging.middleware');
const errorHandler = require('./middlewares/errors.middleware');
const { socketAuthMiddleware } = require('./middlewares/auth.middleware');

const playersRouter = require('./routes/players.routes');
const authRouter = require('./routes/auth.routes');
const gameRouter = require('./routes/game.route');

const { GameServer } = require('./GameServer');
const { joinRoomMiddleware } = require('./middlewares/socket/room.middleware');

const events = require('./socket/events');

const app = express();

const server = new GameServer({
    expressApp: app,
    mongoConfig,
    expressConfig,
    socketConfig
});

server.useOnAPI(express.json());
server.useOnAPI(loggingMiddleware);

server.useOnAPI(playersRouter);
server.useOnAPI(authRouter);
server.useOnAPI(gameRouter);

server.useOnAPI(errorHandler);

server.useOnSockets(socketAuthMiddleware);
server.useOnSockets(joinRoomMiddleware);

Object.values(events)
    .forEach(event => server.registerEvent(event));

server.run();

module.exports = {app,server};
