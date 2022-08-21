const logger = require('consola');
const express = require('express');
const { mongoose } = require('mongoose');

const expressConfig = require('./configs/express.config');
const mongoConfig = require('./configs/mongo.config');

const loggingMiddleware = require('./middlewares/logging.middleware');
const errorHandler = require('./middlewares/errors.middleware');

const playersRouter = require('./routes/players.routes');
const authRouter = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

app.use(playersRouter);
app.use(authRouter);

app.use(errorHandler);

mongoose.connect(mongoConfig.getDbUri(), (error) => {
    if(error) {
        logger.error(`Error connecting to database ${error}`)
        return;
    }
    logger.start(`Connected to database ${mongoConfig.name}`);
    app.listen(expressConfig.port, () => {
        logger.start(`Server started on port ${expressConfig.port}`);
    })
});