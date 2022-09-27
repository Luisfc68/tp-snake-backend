const getConnectionParam = (socket, param) => socket.handshake.query[param];

module.exports = {
    getConnectionParam
}