const { Game } = require('../models/game');

const saveGame = game => new Game(game).save();

module.exports = {
    saveGame
}