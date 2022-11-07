const { BOARD_SIZE } = require('../../configs/game.config');

class SnakeBody {

    #positions
    #movingDirection

    set positions(positions) {
        this.#positions = positions;
    }

    set movingDirection(movingDirection) {
        if (this.#movingDirection === movingDirection || this.#positions.length === 0) {
            return;
        }
        const head = this.#positions[0];
        const neck = this.#positions[1];
        switch (movingDirection) {
            case MOVES.UP:
                if (neck?.y === head.y + 1) {
                    return;
                }
                break;
            case MOVES.DOWN:
                if (neck?.y === head.y - 1) {
                    return;
                }
                break;
            case MOVES.RIGHT:
                if (neck?.x === head.x + 1) {
                    return;
                }
                break;
            case MOVES.LEFT:
                if (neck?.x === head.x - 1) {
                    return;
                }
                break;
        }
        this.#movingDirection = movingDirection;
    }

    get positions() {
        return this.#positions;
    }

    get head() {
        if (this.#positions.length !== 0) {
            return this.#positions[0];
        } else {
            return undefined;
        }
    }

    get movingDirection() {
        return this.#movingDirection;
    }

    move(){
        if (this.#positions.length === 0) {
            return;
        }
        const head = { ...this.#positions[0]};
        switch (this.#movingDirection) {
            case MOVES.UP:
                head.y++;
                break;
            case MOVES.DOWN:
                head.y--;
                break;
            case MOVES.RIGHT:
                head.x++;
                break;
            case MOVES.LEFT:
                head.x--;
                break;
        }
        this.#positions.unshift(head);
        this.#positions.pop();
    }

    isOutOfField() {
        if (this.#positions.length === 0) {
            return false;
        }
        const outOfField = value => value < 0 || value >= BOARD_SIZE;
        return outOfField(this.#positions[0].x) || outOfField(this.#positions[0].y);
    }

    isSelfCollided() {
        if (this.#positions.length === 0) {
            return false;
        }
        const head = this.#positions[0];
        const body = this.#positions.slice(1);
        return body.some(bodyPart => bodyPart.x === head.x && bodyPart.y === head.y);
    }

    grow() {
        let newPart;
        newPart = { ...this.#positions.at(-1)};
        switch (this.#movingDirection) {
            case MOVES.UP:
                newPart.y--;
                break;
            case MOVES.DOWN:
                newPart.y++;
                break;
            case MOVES.RIGHT:
                newPart.x--;
                break;
            case MOVES.LEFT:
                newPart.x++;
                break;
        }
        this.#positions.push(newPart);
    }
}

const MOVES = {
    UP: 'UP',
    DOWN: 'DOWN',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT'
}

module.exports = {
    SnakeBody,
    MOVES
}