const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const { Player } = require('../models/player');
const APIError = require('../errors/APIError');
const { Game } = require('../models/game');
const roomHandler = require('../socket/GameRoomHandler');
const { errors } = require('../constants/errorMessages');

const createGame = function (req, res, next) {
    const playerId = getIdFromAuthenticatedRequest(req);

    return Player.findById(playerId)
        .then(player => {
            if (player) {
                const game = new Game({ owner: player });
                return game.save();
            } else {
                throw new APIError({ statusCode: 404 });
            }
        })
        .then(gameDocument => {
            const gameCreated = roomHandler.registerGame(gameDocument.id);
            if (gameCreated) {
                res.status(201).json(gameDocument);
            } else {
                throw new APIError({
                    statusCode: 409,
                    message: errors.game.creationError
                });
            }
        })
        .catch(next);
}

module.exports = {
    createGame
}