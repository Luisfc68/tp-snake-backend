const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const router = Router();
const auth = '/auth';

router.post(auth, authController.login);
router.post(auth + '/refresh', authController.refresh);

module.exports = router;