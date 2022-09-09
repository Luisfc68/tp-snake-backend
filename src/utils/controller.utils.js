const { isValidId } = require('./mongo');
const APIError = require('../errors/APIError');

const getIdFromAuthenticatedRequest = (req) => {
    const playerId = req.body.id;
    if (!isValidId(playerId)) {
        throw new APIError({ statusCode: 401 });
    }
    return playerId;
}

module.exports = {
    getIdFromAuthenticatedRequest
}