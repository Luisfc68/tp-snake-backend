const { Router } = require("express");
const playersController = require("../controllers/players.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = Router();
const players = '/players';
const playersById = players + '/:id';

router.post(players, playersController.signUp);
router.get(playersById, authMiddleware(), playersController.getPlayer);
router.delete(players, authMiddleware(), playersController.deletePlayer);
router.put(players, authMiddleware(), playersController.updatePlayer);

module.exports = router;