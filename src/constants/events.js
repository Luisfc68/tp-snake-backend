const clientEvents = {
    GAME_START: 'gameStart',
    MOVEMENTS: 'movements',
    DEATH: 'death',
    FINISHED: 'gameFinished',
    FOOD_SPAWN: 'foodSpawn',
    FOOD_EATEN: 'foodEaten'
}

const serverEvents = {
    INIT_GAME: 'initGame',
    DISCONNECT: 'disconnect',
    PLAYER_CONFIRM: 'playerConfirm',
    CHANGE_DIRECTION: 'changeDirection'
}

module.exports = {
    clientEvents,
    serverEvents
}