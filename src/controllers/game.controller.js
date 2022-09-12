const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const { Player } = require('../models/player');
const APIError = require('../errors/APIError');
const { Game } = require('../models/game');

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
        })// TODO crea room en el socket
        .then(createdGame => res.status(201).json(createdGame))
        .catch(next);
}

module.exports = {
    createGame
}