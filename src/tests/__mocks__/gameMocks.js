const validPlayer = require("./playerMocks");
const validGame = {
  winner: null,
  players: null,
  owner: validPlayer,
  maxReachedLevel: null,
  status: 'WAITING',
};
module.exports = validGame;
