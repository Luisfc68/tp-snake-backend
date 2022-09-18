module.exports = class SocketError extends Error {
    name = 'SocketError';
    constructor({ message }) {
        super(message);
    }
}