class MockComplexQueryBuilder {
    #query;

    static fromQuery(query) {
        const queryBuilder = new MockComplexQueryBuilder();
        return queryBuilder;
    }

    where(whereCondition) {
        console.log('dasfafadgdgggdaga')
        return this;
    }
    whereEquals(field, value) {
        if(value){
        }
        return this;
    }

    whereRange(min, max, property) {
        if(min && max && min > max) {
            throw new RangeError(errors.commons.invalidRange(property));
        }
        return this;
    }

    whereRegex(field, pattern) {
        return this;
    }

    limit(limit) {
        return this;
    }

    skip(offset) {
        return this;
    }

    build() {
        return this.#query;
    }
}

module.exports = {
    MockComplexQueryBuilder
}