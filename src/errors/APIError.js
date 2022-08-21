module.exports = class APIError extends Error {
    name = 'APIError';
    constructor({ message, statusCode }) {
        super(message);
        this.statusCode = statusCode;
    }
}