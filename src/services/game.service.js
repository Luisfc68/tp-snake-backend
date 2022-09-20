const { Game } = require('../models/game');

const saveGame = game => new Game(game).save();
const findByGameId = id => Game.findById(id);

module.exports = {
    saveGame,
    findByGameId
}