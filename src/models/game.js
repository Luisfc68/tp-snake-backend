const { Schema, model, Types} = require('mongoose');
const { playerSchema } = require('./player');
const {errors} = require("../constants/errorMessages");

const gameSchema = new Schema(
    {
        winner: {
            type: Types.ObjectId,
            ref: 'Player'
        },
        players: [
            {
                default: [],
                type: Types.ObjectId,
                ref: 'Player'
            }
        ],
        owner: {
            required: [true, errors.commons.mandatory],
            type: playerSchema,
            excludeIndexes: true
        },
        maxReachedLevel: {
            type: Number,
            default: 1
        },
        status: {
            type: String,
            enum: ['WAITING', 'PLAYING', 'FINISHED'],
            default: 'WAITING'
        }
    },
    {
        collection: 'games',
        timestamps: true,
        versionKey: false
    }
);

gameSchema.set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
    }
});

const Game = model('Game', gameSchema);
module.exports = {
    Game
}