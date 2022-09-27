const { errors } = require('../../constants/errorMessages');
const { getConnectionParam } = require('../../utils/socket.utils');
const roomHandler = require('../../socket/game/RoomHandler');

const joinRoomMiddleware = function (socket, next) {
    const gameId = getConnectionParam(socket, 'gameId');

    const game = roomHandler.getGame(gameId);
    if (!game) {
        next({ error: errors.game.gameNotFound });
        return;
    }

    game.addPlayer(socket)
        .then(() => {
            socket.join(gameId)
            next();
        })
        .catch(next);
}

module.exports = {
    joinRoomMiddleware
}