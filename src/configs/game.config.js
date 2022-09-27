const { errors } = require('../constants/errorMessages');
const BOARD_SIZE = Number(process.env.BOARD_SIZE);
const SPEED_UP_INTERVAL = Number(process.env.SPEED_UP_INTERVAL);
const MINIMUM_SPEED = Number(process.env.MINIMUM_SPEED);
const SPEED_REDUCTION = Number(process.env.SPEED_REDUCTION);
const INITIAL_SPEED = Number(process.env.INITIAL_SPEED);

const gameEnv = {
    BOARD_SIZE,
    SPEED_UP_INTERVAL,
    MINIMUM_SPEED,
    SPEED_REDUCTION,
    INITIAL_SPEED
};

if (Object.values(gameEnv).some(isNaN)) {
    throw new Error(errors.commons.environmentGeneric);
}

module.exports = gameEnv;