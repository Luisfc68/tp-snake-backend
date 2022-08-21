
const validationErrorResponse = (err) => {
    for (let prop in err.errors) {
        err.errors[prop] = err.errors[prop].message;
    }
    return err.errors;
}

module.exports = function (err, req, res, next) {
    if (err.name === 'ValidationError') {
        res.status(400).json(validationErrorResponse(err));
    } else {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}
