const { serverEvents } = require('../../constants/events');
const { getConnectionParam } = require('../../utils/socket.utils');
const roomHandler = require('../game/RoomHandler');
const { errors } = require('../../constants/errorMessages');

module.exports = {
    name: serverEvents.CHANGE_DIRECTION,
    handler: function (args) {
        const gameId = getConnectionParam(this, 'gameId');
        const playerId = getConnectionParam(this, 'playerId');

        const game = roomHandler.getGame(gameId);
        if (!game) {
            this.emit(serverEvents.CHANGE_DIRECTION, { error: errors.game.gameNotFound });
            return;
        }

        const player = game.getPlayer(playerId);
        if (!player) {
            this.emit(serverEvents.CHANGE_DIRECTION, { error: errors.player.playerNotFound });
            return;
        }

        player.snakeBody.movingDirection = args.movingDirection;
    }
}