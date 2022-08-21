const { SECRET, REFRESH_SECRET } = require('../configs/jwt.config');
const { verify, sign } = require('jsonwebtoken');
const { createHash } = require('crypto');
const EnvironmentError = require("../errors/EnvironmentError");

const validateToken = (token, secret, callback) => verify(token, secret, {}, callback);

const validateAccessToken = (token, callback) => validateToken(token, SECRET, callback);
const validateRefreshToken = (token, callback) => validateToken(token, REFRESH_SECRET, callback);

const hash = (text) => createHash('sha256').update(text).digest('hex');

const signToken = (id, secret, expireTime) => sign({ id }, secret, { expiresIn: expireTime });

const generateTokens = ({ id, includeRefreshToken = true}) => {
    if (!SECRET) {
        throw new EnvironmentError('SECRET');
    }
    const result = {
        accessToken: signToken(id, SECRET, '1h')
    };
    if (includeRefreshToken && REFRESH_SECRET) {
        result.refreshToken = signToken(id, REFRESH_SECRET, '8h')
    } else if (includeRefreshToken) {
        throw new EnvironmentError('REFRESH_SECRET');
    }
    return result;
}

module.exports = {
    validateAccessToken,
    validateRefreshToken,
    hash,
    generateTokens
}