const { Player } = require('../models/player');
const { hash } = require('../utils/security.utils');
const APIError = require('../errors/APIError');
const { errors } = require('../constants/errorMessages');
const { isValidId } = require('../utils/mongo.utils');
const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const { saveImage, getImage } = require('../utils/fileSystem.utils');

const signUp = function (req, res, next) {
    const { email, username, password } = req.body;
    const player = new Player({
        email,
        username,
        password: hash(password)
    });
    Player.validate(player)
        .then(() => Player.find({ email }).exec())
        .then(playerDocuments => {
            if (playerDocuments.length) {
                throw new APIError({
                    statusCode: 409,
                    message: errors.player.existingEmail
                });
            } else {
                return player.save();
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
    Player.findById(playerId)
        .then(player => {
            if (player) {
                res.json(player);
            } else {
                throw new APIError({ statusCode: 404 });
            }
        })
        .catch(next);
}
const getAllPlayers= function(req,res,next){
    const offset=req.query.offset||0;
    const limit=req.query.limit||10;
    const player=req.body.player||null;
    Player.find(player).skip(offset).limit(limit)
    .then(players=> 
            res.json(players)
        ).catch(next);

}
const getAllPlayersByWinGames= function(req,res,next){
    const offset=req.query.offset||0;
    const limit=req.query.limit||10;
    const winMin=req.query.winMin||0;
    const winMax= req.query.winMax||null;
    if(winMax==null){
        Player.find(
            {"gamesWon":{$gte:winMin}}
        ).skip(offset).limit(limit)
        .then(players=> 
                res.json(players)
            ).catch(next);
    }
    else{
        Player.find(
            {"gamesWon":{$gte:winMin,$lte: winMax}}
        ).skip(offset).limit(limit)
        .then(players=> 
                res.json(players)
            ).catch(next);
    }
    

}

const deletePlayer = function (req, res, next) {
    const playerId = getIdFromAuthenticatedRequest(req);

    Player.findByIdAndDelete(playerId)
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

    Player.find({ email })
        .then(playerDocuments => {
            if (playerDocuments.length) {
                throw new APIError({
                    statusCode: 409,
                    message: errors.player.existingEmail
                });
            } else {
                return Player.findByIdAndUpdate(playerId, update);
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
    saveImage('players', playerId, req.file)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
}

const getPlayerImage = function (req, res, next) {
    const playerId = req.params.id;
    getImage('players', playerId, true)
        .then(imageName => {
            if (!imageName) {
                throw new APIError({ statusCode: 404 });
            }
            res.sendFile(imageName, () => res.status(404).send());
        })
        .catch(next);
}

module.exports = {
    signUp,
    getPlayer,
    getAllPlayers,
    getAllPlayersByWinGames,
    deletePlayer,
    updatePlayer,
    uploadPlayerImage,
    getPlayerImage
}