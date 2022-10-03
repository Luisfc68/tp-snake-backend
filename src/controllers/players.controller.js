const { hash } = require('../utils/security.utils');
const APIError = require('../errors/APIError');
const { errors } = require('../constants/errorMessages');
const { isValidId, ComplexQueryBuilder } = require('../utils/db');
const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const { saveImage, getImage } = require('../utils/fileSystem.utils');
const playerService = require('../services/players.service');

const signUp = function (req, res, next) {
    const { email, username, password } = req.body;
    const player = {
        email,
        username,
        password: hash(password)
    };
    return playerService.validatePlayer(player)
        .then(() => playerService.findPlayer({ email }))
        .then(playerDocuments => {
            if (playerDocuments.length) {
                throw new APIError({
                    statusCode: 409,
                    message: errors.player.existingEmail
                });
            } else {
                return playerService.savePlayer(player);
            }
        })
        .then(savedPlayer => res.status(201).json(savedPlayer))
        .catch(next);
}

const getPlayer = function (req, res, next) {
    const playerId = req.params.id;
    if (!isValidId(playerId)) {
        throw new APIError({ statusCode: 404 });
    }
    return playerService.findPlayerById(playerId)
        .then(player => {
            if (player) {
                res.json(player);
            } else {
                throw new APIError({ statusCode: 404 });
            }
        })
        .catch(next);
}
const getPlayers = function(req,res,next) {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const {
        gamesWonMin, gamesWonMax,
        playedGamesMin, playedGamesMax,
        winRatioMin, winRatioMax
    } = req.query;

    return ComplexQueryBuilder.fromQuery(playerService.findPlayer())
        .whereRegex('username', req.query.username)
        .whereRegex('email', req.query.email)
        .whereRange(gamesWonMin, gamesWonMax, 'gamesWon')
        .whereRange(playedGamesMin, playedGamesMax, 'playedGames')
        .whereRange(winRatioMin, winRatioMax, 'winRatio')
        .limit(limit)
        .skip(offset)
        .build()
        .then(players => res.json(players))
        .catch(next);
}

const deletePlayer = function (req, res, next) {
    const playerId = getIdFromAuthenticatedRequest(req);

    return playerService.deletePlayer(playerId)
        .then(result => {
            if (result) {
                res.json(result);
            } else {
                throw new APIError({ statusCode: 404 });
            }
        })
        .catch(next);
}

const updatePlayer = function (req, res, next) {
    const playerId = getIdFromAuthenticatedRequest(req);
    const { username, password, email } = req.body;
    const update = { username, password: hash(password), email };

    return playerService.validatePlayer(update)
        .then(() => playerService.findPlayer({ email }))
        .then(playerDocuments => {
            const isAnotherPersonEmail = playerDocuments.some(document => document.id !== playerId);
            if (isAnotherPersonEmail) {
                throw new APIError({ statusCode: 409, message: errors.player.existingEmail });
            } else {
                return playerService.updatePlayer({ id: playerId, updatedPlayer: update });
            }
        })
        .then(result => {
            if (result) {
                res.status(204).send();
            } else {
                throw new APIError({ statusCode: 404 });
            }
        })
        .catch(next);
}

const uploadPlayerImage = function (req, res, next) {
    const playerId = getIdFromAuthenticatedRequest(req);
    return saveImage('players', playerId, req.file)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
}

const getPlayerImage = function (req, res, next) {
    const playerId = req.params.id;
    return getImage('players', playerId, true)
        .then(imageName => {
            if (!imageName) {
                throw new APIError({ statusCode: 404 });
            }
            res.sendFile(imageName, {}, err => {
                if (err) {
                    res.status(404).send();
                }
            });
        })
        .catch(next);
}

module.exports = {
    signUp,
    getPlayer,
    getPlayers,
    deletePlayer,
    updatePlayer,
    uploadPlayerImage,
    getPlayerImage
}