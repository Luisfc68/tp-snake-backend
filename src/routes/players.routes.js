const { Router } = require('express');
const playersController = require('../controllers/players.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { multipartMiddleware } = require('../middlewares/multer.middleware');

const router = Router();
const players = '/players';
const playersById = players + '/:id';

router.post(players, playersController.signUp);
router.get(playersById, authMiddleware(), playersController.getPlayer);
router.get(players,authMiddleware(),playersController.getPlayers);
//router.get(players + '/winRatio',authMiddleware(),playersController.getPlayersByWinRatio);
router.delete(players, authMiddleware(), playersController.deletePlayer);
router.put(players, authMiddleware(), playersController.updatePlayer);
router.put(players + '/images', multipartMiddleware.single('image'), authMiddleware(), playersController.uploadPlayerImage);
router.get(players + '/images/:id', playersController.getPlayerImage);

module.exports = router;