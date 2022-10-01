jest.mock('../../../models/game')
const {Game} = require('../../../models/game')
const GameService = require('../../../services/game.service.js')

describe('Game service tests', () => {
    describe('Save Game tests', () => {
        test('should use save function from Game object', () => {
            let game = new Game()
            const spy= jest.spyOn(game, 'save')
            GameService.saveGame()
            expect(spy).toHaveBeenCalled();
        })
    })
    describe('Find game tests', () => {
        test('should use find function from Game object', () => {
            const spy= jest.spyOn(Game, 'find')
            GameService.findGame()
            expect(spy).toHaveBeenCalled();
        })
    })
    describe('Find game by key tests', () => {
        test('should use findById function from Game object', () => {
            const spy= jest.spyOn(Game, 'findById')
            GameService.findByGameId()
            expect(spy).toHaveBeenCalled();
        })
    })
})