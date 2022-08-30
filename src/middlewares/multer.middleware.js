const { multerConfig, supportedMimes } = require('../configs/multer.config');
const multer = require('multer');
const APIError = require('../errors/APIError');

const multipartMiddleware = multer({
    ...multerConfig,
    fileFilter: (req, file, next) => {
        if (supportedMimes.includes(file.mimetype)) {
            next(null, true);
        } else {
            next(new APIError({ statusCode: 415 }));
        }
    }
});

module.exports = {
    multipartMiddleware
}