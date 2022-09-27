const clientEvents = {
    GAME_START: 'gameStart',
    MOVEMENTS: 'movements',
    DEATH: 'death',
    FINISHED: 'gameFinished'
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