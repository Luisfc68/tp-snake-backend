const { Player } = require('../models/player');

const validatePlayer = document => Player.validate(document);
const findPlayer = query => Player.find(query);
const updatePlayer = ({ id, updatedPlayer }) => Player.findByIdAndUpdate(id, updatedPlayer);
const deletePlayer = id => Player.findByIdAndDelete(id);
const findPlayerById = id => Player.findById(id);
const savePlayer = player => new Player(player).save();

module.exports = {
    validatePlayer,
    findPlayer,
    updatePlayer,
    deletePlayer,
    findPlayerById,
    savePlayer
}


