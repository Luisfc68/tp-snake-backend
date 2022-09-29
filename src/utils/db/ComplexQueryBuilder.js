const { whereRange, whereRegex } = require('./db.utils');

class ComplexQueryBuilder {
    #query;

    static fromQuery(query) {
        const queryBuilder = new ComplexQueryBuilder();
        queryBuilder.#query = query;
        return queryBuilder;
    }

    where(whereCondition) {
        this.#query.where(whereCondition);
        return this;
    }
    whereEquals(field, pattern) {
        if(pattern){
        this.#query.where(field).equals(pattern)
        }
        return this;
    }

    whereRange(min, max, property) {
        this.#query = whereRange({ query: this.#query, min, max, property });
        return this;
    }

    whereRegex(field, pattern) {
        this.#query = whereRegex(this.#query, field, pattern);
        return this;
    }

    limit(limit) {
        this.#query.limit(limit);
        return this;
    }

    skip(offset) {
        this.#query.skip(offset);
        return this;
    }

    build() {
        return this.#query;
    }
}

module.exports = {
    ComplexQueryBuilder
}