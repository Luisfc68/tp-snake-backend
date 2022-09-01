const { Player } = require('../models/player');
const { hash } = require('../utils/security.utils');
const APIError = require('../errors/APIError');
const { errors } = require('../constants/errorMessages');
const { isValidId } = require('../utils/mongo.utils');
const { getIdFromAuthenticatedRequest } = require('../utils/controller.utils');
const { saveImage, getImage } = require('../utils/fileSystem.utils');
const { text } = require('express');

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
    const player=req.body.player||null;
    Player.find(player).skip(offset).limit(limit)
    .then(players=> 
            res.json(players)
        ).catch(next);

}
const getPlayersByGamesWon= function(req,res,next){
    const offset=req.query.offset||0;
    const limit=req.query.limit||10;
    const winMin=req.query.winMin||0;
    const winMax= req.query.winMax||null;
    if(winMax==null){
        Player.find().where("gamesWon").gte(winMin).skip(offset).limit(limit)
        .then(players=> 
                res.json(players)
            ).catch(next);
    }
    else{
        Player.find().where("gamesWon").gte(winMin).lte(winMax).skip(offset).limit(limit)
        .then(players=> 
                res.json(players)
            ).catch(next);
    }
    

}
const getPlayersByPlayedGames= function(req,res,next){
    const offset=req.query.offset||0;
    const limit=req.query.limit||10;
    const playedGamesMin=req.query.playedGamesMin||0;
    const playedGamesMax= req.query.playedGamesMax||null;
    if(playedGamesMax==null){
        Player.find().where("playedGames").gte(playedGamesMin).skip(offset).limit(limit)
        .then(players=> 
                res.json(players)
            ).catch(next);
    }
    else{
        Player.find().where("playedGames").gte(playedGamesMin).lte(playedGamesMax).skip(offset).limit(limit)
        .then(players=> 
                res.json(players)
            ).catch(next);
    }
    

}

//{ }
const getPlayersByWinRatio= function(req,res,next){
    const offset=req.query.offset||0;
    const limit=req.query.limit||10;
    const winRatioMin=req.query.winRatioMin||0;
    const winRatioMax= req.query.winRatioMax||null;
    let playersByWinRatio=[];
        Player.aggregate([ 
            {$project: {
                _id:"$_id",
                username:"$username",
                email: "$email",
                playedGames:"$playedGames",
                gamesWon:"$gamesWon",
                winRatio:{
                    $cond: [
                        {$gt:["$playedGames",0]},
                        {$divide:["$gamesWon","$playedGames"] }, 
                        0 
                    ]
                }
            }
        },
        ]).sort({"winRatio":-1}).skip(offset).limit(limit)
        .then(players=>
                {players.forEach(player => {
                    if(winRatioMax==null){
                    if(player.winRatio>=winRatioMin){
                        playersByWinRatio.push(player)
                    }
                    }
                    else{
                        if(player.winRatio>=winRatioMin && player.winRatio<=winRatioMax){
                            playersByWinRatio.push(player)
                        }
                    }
                });
              res.json(playersByWinRatio)      
            }
            ).catch(next);
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
    getPlayersByGamesWon,
    getPlayersByPlayedGames,
    getPlayersByWinRatio,
    deletePlayer,
    updatePlayer,
    uploadPlayerImage,
    getPlayerImage
}