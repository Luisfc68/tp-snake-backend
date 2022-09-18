const SocketError = require('../../errors/SocketError');
const { errors } = require('../../constants/errorMessages');
const roomHandler = require('../../socket/GameRoomHandler');

const roomMiddleware = function (socket, next) {
    const roomToJoin = socket.handshake.query.gameId;
    const successfulJoin = roomHandler.joinGame({ gameId: roomToJoin, socketId: socket.id });
    if (successfulJoin) {
        next();
    } else {
        next(new SocketError({ message: errors.game.gameNotFound }));
    }
}

module.exports = {
    roomMiddleware
}