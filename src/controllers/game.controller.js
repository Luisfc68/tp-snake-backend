const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const APIError = require('../errors/APIError');
const { errors } = require('../constants/errorMessages');
const playerService = require('../services/players.service');
const gameService = require('../services/game.service');
const roomHandler = require('../socket/game/RoomHandler');
const { isValidId, ComplexQueryBuilder } = require('../utils/db');


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
                roomHandler.createGame(gameDocument.id);
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

const getGame = function (req, res, next) {
    const gameId = req.params.id;
    if (!isValidId(gameId)) {
        throw new APIError({ statusCode: 404 });
    }
    gameService.findByGameId(gameId)
        .then(game => {
            if (game) {
                res.json(game);
            } else {
                throw new APIError({ statusCode: 404 });
            }
        })
        .catch(next);
}

const getGames = function(req,res,next) {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const {
        reachedLevelMin, reachedLevelMax,
    } = req.query;
    const playerOwner= validatePlayer(req.query.ownerId,next)
    const playerWinner = validatePlayer(req.query.winnerId,next)

    ComplexQueryBuilder.fromQuery(gameService.findGame())
        .whereEquals('owner', playerOwner)
        .whereEquals('winner', playerWinner)
        .whereRange(reachedLevelMin, reachedLevelMax, 'maxReachedLevel')
        .whereEquals('status', req.query.status)
        .limit(limit)
        .skip(offset)
        .build()
        .then(games => res.json(games))
        .catch(next);
}

function validatePlayer(id,next) {
    if(id){
        if (!isValidId(id)) {
            throw new APIError({ statusCode: 404 });
        }
        playerService.findPlayerById(id).then(player => {
            if (player) {
                return player
            } else {
                throw new APIError({ statusCode: 404 });
            }}).catch(next);
    }
    else{
        return null
    }
}


module.exports = {
    createGame,
    getGame,
    getGames
}