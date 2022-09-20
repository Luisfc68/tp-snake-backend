const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const APIError = require('../errors/APIError');
const { errors } = require('../constants/errorMessages');
const playerService = require('../services/players.service');
const gameService = require('../services/game.service');

const createGame = function (req, res, next) {
    const playerId = getIdFromAuthenticatedRequest(req);

    return playerService.findPlayerById(playerId)
        .then(player => {
            if (player) {
                const game = { owner: player };
                return gameService.saveGame(game);
            } else {
                throw new APIError({ statusCode: 404 });
            }
        })
        .then(gameDocument => {
            if (gameDocument) {
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