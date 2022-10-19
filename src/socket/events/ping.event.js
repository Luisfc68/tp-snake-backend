const logger = require('consola');

module.exports = {
    name: 'ping',
    handler: function (args) {
        logger.info(`ping recibido, args: ${args}`);
    }
}