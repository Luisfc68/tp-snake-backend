const roomHandler = require('../game/RoomHandler');
const logger = require('consola');
const { getConnectionParam } = require('../../utils/socket.utils');
const { serverEvents } = require('../../constants/events');

const logError = (playerId, gameId) => logger.error(`Error disconnecting ${playerId} from room ${gameId}`);

module.exports = {
    name: serverEvents.DISCONNECT,
    handler: async function (args) {
        const gameId = getConnectionParam(this, 'gameId');
        const playerId = getConnectionParam(this, 'playerId');

        const game = roomHandler.getGame(gameId);
        if (!game) {
            logError(playerId, gameId);
            return;
        }
        const deleted = await game.removePlayer(this);
        if (deleted) {
            game.emit(serverEvents.PLAYER_LEFT, playerId);
        }
    }
}