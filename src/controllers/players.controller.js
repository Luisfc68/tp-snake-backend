const { Player } = require('../models/player');
const { hash } = require('../utils/security.utils');
const APIError = require('../errors/APIError');
const { errors } = require('../constants/errorMessages');
const { isValidId } = require('../utils/mongo.utils');
const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const { saveImage, getImage } = require('../utils/fileSystem.utils');
const { text } = require('express');
const { use } = require('../routes/players.routes');

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
const getPlayers= function(req,res,next){
    const offset=req.query.offset||0;
    const limit=req.query.limit||10;
    const username=req.query.username||null;
    const email=req.query.email||null;
    let query= Player.find();
    query=generateQueryConditions({query:query,field:"username",value:username});
    query=generateQueryConditions({query:query,field:"email",value:email});
    query=generateQueryMinMax(query,req.query.gamesWonMin,req.query.gamesWonMax,"gamesWon");
    query=generateQueryMinMax(query,req.query.playedGamesMin,req.query.playedGamesMax,"playedGames");
    query=generateQueryMinMax(query,req.query.winRatioMin,req.query.winRatioMax,"winRatio");
    query.limit(limit).skip(offset).then(players=> 
        res.json(players)
    ).catch(next);

}

function generateQueryMinMax(query,min,max,property){
    checkMinMax(min,max);
    if(min && max){
        return query.where(property).gte(min).lte(max);
    }
    else if(min){
        return query.where(property).gte(min);
    }
    else if(max){
        return query.where(property).lte(max);
    }
    else{
        return query;
    }
}

function checkMinMax(min,max){
    if(min && max && min>max){
        throw new APIError({ statusCode: 400});
    }
}

function generateQueryConditions({query,field,value}){
    if(value){
        return query.where({[field]:value})
    }
    return query;

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
    getPlayers,
    deletePlayer,
    updatePlayer,
    uploadPlayerImage,
    getPlayerImage
}