const { Types } = require("mongoose");

const isValidId = (id) => Types.ObjectId.isValid(id);

module.exports = {
    isValidId
}