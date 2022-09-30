const { Router } = require('express');
const gameController = require('../controllers/game.controller')
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = Router();
const game = '/game';
const gameById = game + '/:id';


router.post(game, authMiddleware(), gameController.createGame);
router.get(game, authMiddleware(), gameController.getGames);
router.get(gameById, authMiddleware(), gameController.getGame);


module.exports = router;