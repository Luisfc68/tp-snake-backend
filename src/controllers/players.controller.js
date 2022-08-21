const { Player } = require('../models/player');
const { hash } = require('../utils/securityUtils');
const APIError = require('../errors/APIError');
const { errors } = require('../constants/errorMessages');
const { isValidId } = require("../utils/mongo.utils");

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

module.exports = {
    signUp,
    getPlayer
}