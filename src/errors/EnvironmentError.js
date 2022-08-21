const { errors } = require('../constants/errorMessages');

module.exports = class EnvironmentError extends Error {
    name = 'EnvironmentError';
    constructor(variableName) {
        super(variableName ?
            errors.commons.environmentSpecific(variableName) :
            errors.commons.environmentGeneric
        );
    }
}