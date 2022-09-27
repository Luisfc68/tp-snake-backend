const APIError = require('../errors/APIError');
const { validateAccessToken } = require('../utils/security.utils');
const { errors } = require('../constants/errorMessages');

const BEARER = 'Bearer ';

const throwUnauthorizedError = function () {
    throw new APIError({
        statusCode: 401,
        message: errors.auth.invalidToken
    });
}

const getTokenFromRequest = function (req) {
    const token = req.get('Authorization');
    if (!token || !token.startsWith(BEARER)) {
        throwUnauthorizedError();
    }
    return token.slice(BEARER.length);
}

// si se quieren manejar roles agregar un parametro a la funcion y que authMiddleware sea un closure
const authMiddleware = function () {
    return function (req, res, next) {
        const token = getTokenFromRequest(req);
        validateAccessToken(token, (err, decoded) => {
            if (err) {
                throwUnauthorizedError();
            }
            req.body.id = decoded.id;
            next();
        });
    }
}

const socketAuthMiddleware = function (socket, next) {
    const token = socket.handshake.auth.token;
    validateAccessToken(token, (err, decoded) => {
        if (err) {
            next({ error: errors.auth.invalidToken });
        } else {
            socket.handshake.query.playerId = decoded.id;
            next();
        }
    })
}

module.exports = {
    authMiddleware,
    socketAuthMiddleware
}