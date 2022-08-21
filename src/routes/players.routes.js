const { Router } = require("express");
const playersController = require("../controllers/players.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = Router();
const players = '/players';

router.post(players, playersController.signUp);
router.get(players + '/:id', authMiddleware(), playersController.getPlayer);

module.exports = router;