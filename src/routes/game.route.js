const { Router } = require('express');
const gameController = require('../controllers/game.controller')
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = Router();
const game = '/game';

router.post(game, authMiddleware(), gameController.createGame)

module.exports = router;