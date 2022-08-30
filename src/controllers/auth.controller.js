const { Player } = require('../models/player');
const { hash, generateTokens, validateRefreshToken } = require('../utils/security.utils');
const { errors } = require('../constants/errorMessages');

const authErrorResponse = (res, message) => res.status(401)
    .json({ error: message })
    .send();

const login = function (req, res, next) {
    const { email, password } = req.body;

    Player.findOne({ email })
    .then(player => {
        if (!player || player?.password !== hash(password)) {
            authErrorResponse(res, errors.auth.invalidCredentials);
        }
        const tokens = generateTokens({ id: player.id });
        res.status(200).json(tokens).send();
    })
    .catch(next);
}

const refresh = function (req, res) {
    const { refreshToken } = req.body;

    validateRefreshToken(refreshToken, (error, decoded) => {
        if (error) {
            authErrorResponse(res, errors.auth.invalidToken);
        } else {
            const token = generateTokens({ id: decoded.id, includeRefreshToken: false });
            res.status(200).json(token).send();
        }
    });
}

module.exports = {
    login,
    refresh
}
