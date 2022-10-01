jest.mock('../../../models/player')
const {Player} = require('../../../models/player')
const PlayerService = require('../../../services/players.service.js')
const mockValidPlayer= require('../../__mocks__/playerMocks')

describe('Player service tests', () => {

    describe('Validate player tests', () => {
        test('should use save validate from Player object', () => {
            const spy= jest.spyOn(Player, 'validate')
            PlayerService.validatePlayer(mockValidPlayer)
            expect(spy).toHaveBeenCalled();
        })
    })
    describe('Save player tests', () => {
        test('should use save function from Player object', () => {
            let player = new Player()
            const spy= jest.spyOn(player, 'save')
            PlayerService.savePlayer()
            expect(spy).toHaveBeenCalled();
        })
    })
    describe('Find player tests', () => {
        test('should use find function from Player object', () => {
            const spy= jest.spyOn(Player, 'find')
            PlayerService.findPlayer()
            expect(spy).toHaveBeenCalled();
        })
    })
    describe('Find game by id tests', () => {
        test('should use findById function from Player object', () => {
            const spy= jest.spyOn(Player, 'findById')
            PlayerService.findPlayerById()
            expect(spy).toHaveBeenCalled();
        })
    })
    describe('Update player tests', () => {
        test('should use findByIdAndUpdate function from Player object', () => {
            let mockPlayer = {
                id: null,
                updatePlayer: null
            }
            const spy= jest.spyOn(Player, 'findByIdAndUpdate')
            PlayerService.updatePlayer(mockPlayer)
            expect(spy).toHaveBeenCalled();
        })
    })
    describe('Delete player tests', () => {
        test('should use findByIdAndDelete function from Player object', () => {
            const spy= jest.spyOn(Player, 'findByIdAndDelete')
            PlayerService.deletePlayer()
            expect(spy).toHaveBeenCalled();
        })
    })

})