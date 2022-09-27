const { getConnectionParam } = require('../../utils/socket.utils');
const roomHandler = require('../game/RoomHandler');
const { errors } = require('../../constants/errorMessages');
const { serverEvents, clientEvents } = require('../../constants/events');
const { BOARD_SIZE } = require('../../configs/game.config');

module.exports = {
    name: serverEvents.INIT_GAME,
    handler: async function (args) {
        const gameId = getConnectionParam(this, 'gameId');
        const playerId = getConnectionParam(this, 'playerId');

        const game = roomHandler.getGame(gameId);
        if (!game) {
            this.emit(serverEvents.INIT_GAME, { error: errors.game.gameNotFound });
            return;
        } else if (!game.allPlayersConfirmed()) {
            this.emit(serverEvents.INIT_GAME, { error: errors.game.missingConfirmations });
            return;
        }
        game.init(playerId)
            .then(() => game.emit(clientEvents.GAME_START, { boardSize: BOARD_SIZE }))
            .catch(e => this.emit(serverEvents.INIT_GAME, { error: e.message }));
    }
}