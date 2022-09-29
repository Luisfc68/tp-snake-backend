const { Game } = require('../models/game');

const saveGame = game => new Game(game).save();
const findByGameId = id => Game.findById(id);
const findGame = query => Game.find(query);

module.exports = {
    saveGame,
    findByGameId,
    findGame
}