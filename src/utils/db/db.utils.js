const { Types } = require('mongoose');
const { errors } = require('../../constants/errorMessages');

const isValidId = (id) => Types.ObjectId.isValid(id);

const whereRange = ({ query, min, max, property }) => {
    checkMinMax(min,max, property);
    if(min && max) {
        return query.where(property).gte(min).lte(max);
    } else if(min) {
        return query.where(property).gte(min);
    } else if(max) {
        return query.where(property).lte(max);
    } else {
        return query;
    }
}

const checkMinMax = (min, max, property) => {
    if(min && max && min > max) {
        throw new RangeError(errors.commons.invalidRange(property));
    }
}

const whereRegex = (query, field, pattern) => pattern? query.where({ [field]: { $regex: pattern, $options: 'i' } }) : query;

module.exports = {
    isValidId,
    whereRange,
    whereRegex
}