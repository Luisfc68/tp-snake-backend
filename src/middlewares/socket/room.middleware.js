const SocketError = require('../../errors/SocketError');
const { errors } = require('../../constants/errorMessages');
const gameService = require('../../services/game.service');
const { isValidId } = require('../../utils/db');

const joinRoomMiddleware = function (socket, next) {
    const roomToJoin = socket.handshake.query.gameId;
    const playerId = socket.handshake.query.playerId;
    if (!isValidId(roomToJoin)) {
        next(new SocketError({ message: errors.game.gameNotFound }));
        return;
    }
    gameService.findByGameId(roomToJoin)
        .then(game => {
           if (game && game.status === 'WAITING') {
               game.players.push(playerId);
               return game.save();
           } else {
               next(new SocketError({ message: errors.game.gameNotFound }));
               return;
           }
        })
        .then(updatedGame => {
            if (updatedGame) {
                socket.join(roomToJoin)
                next();
            }
        });
}

module.exports = {
    joinRoomMiddleware
}