const roomHandler = require('../game/RoomHandler');
const { getConnectionParam } = require('../../utils/socket.utils');
const { errors } = require('../../constants/errorMessages');
const { serverEvents } = require('../../constants/events');

module.exports = {
    name: serverEvents.PLAYER_UNCONFIRMED,
    handler: function (args) {
        const gameId = getConnectionParam(this, 'gameId');

        const game = roomHandler.getGame(gameId);
        if (!game) {
            this.emit(serverEvents.PLAYER_UNCONFIRMED, { error: errors.game.gameNotFound });
            return;
        }
        const confirmed = game.playerUnconfirmed(this);
        if (!confirmed) {
            this.emit(serverEvents.PLAYER_UNCONFIRMED, { error: errors.player.playerNotFound });
        }
    }
}