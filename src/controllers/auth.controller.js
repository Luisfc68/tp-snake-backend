const { hash, generateTokens, validateRefreshToken } = require('../utils/security.utils');
const { errors } = require('../constants/errorMessages');
const playerService = require('../services/players.service');

const authErrorResponse = (res, message) => res.status(401)
    .json({ error: message })
    .send();

const login = function (req, res, next) {
    const { email, password } = req.body;

    playerService.findPlayer({ email })
    .then(players => {
        if (!players.length || players[0]?.password !== hash(password)) {
            authErrorResponse(res, errors.auth.invalidCredentials);
            return;
        }
        const tokens = generateTokens({ id: players[0].id });
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
