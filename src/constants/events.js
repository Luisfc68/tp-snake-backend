const clientEvents = {
    GAME_START: 'gameStart',
    MOVEMENTS: 'movements',
    DEATH: 'death',
    FINISHED: 'gameFinished',
    FOOD_SPAWN: 'foodSpawn',
    FOOD_EATEN: 'foodEaten',
    LEVEL_UP: 'levelUp'
}

const serverEvents = {
    INIT_GAME: 'initGame',
    DISCONNECT: 'disconnect',
    PLAYER_CONFIRM: 'playerConfirm',
    PLAYER_UNCONFIRMED: 'playerUnconfirmed',
    CHANGE_DIRECTION: 'changeDirection',
    PLAYER_JOIN: 'playerJoin',
    PLAYER_LEFT: 'playerLeft'
}

module.exports = {
    clientEvents,
    serverEvents
}