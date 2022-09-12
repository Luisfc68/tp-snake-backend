const { Schema, model } = require("mongoose");
const { errors } = require('../constants/errorMessages');
const regex = require('../constants/regex');

const playerSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, errors.commons.mandatory],
        },
        email: {
            type: String,
            required: [true, errors.commons.mandatory],
            unique: true,
            match: [regex.email, errors.player.invalidEmail]
        },
        password: {
            type: String,
            required: [true, errors.commons.mandatory],
        },
        playedGames: {
            type: Number,
            default: 0
        },
        gamesWon: {
            type: Number,
            default: 0
        },
        winRatio: {
            type: Number,
            default: 0
        }
    },
    {
        collection: 'players',
        timestamps: true,
        versionKey: false
    }
);

playerSchema.pre(['save', 'updateOne'], function(next) {
    this.winRatio = this.playedGames?  this.gamesWon / this.playedGames : 0;
    next();
});

playerSchema.set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        object.image = `/players/images/${object.id}`;
        delete object._id;
        delete object.password;
    }
});

const Player = model('Player', playerSchema);
module.exports = {
    Player,
    playerSchema
}