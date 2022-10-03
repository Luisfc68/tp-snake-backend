const gameController = require('../../../controllers/game.controller')
const { getIdFromAuthenticatedRequest } = require('../../../utils/controller.utils');
const playerService = require('../../../services/players.service');
const gameService = require('../../../services/game.service');
const roomHandler = require('../../../socket/game/RoomHandler');
const mockPlayer= require('../../__mocks__/playerMocks');
const mockGame= require('../../__mocks__/gameMocks');
let {req,res,next} = require('../../__mocks__/expressObjectMocks');
const { isValidId, whereRange, ComplexQueryBuilder } = require('../../../utils/db');


jest.mock('../../../utils/controller.utils')
jest.mock('../../../services/players.service')
jest.mock('../../../services/game.service')
jest.mock('../../../socket/game/RoomHandler')
jest.mock('../../../utils/db')

const query = { 
    then: function () {
        return Promise.resolve(mockGame);
    }
}

beforeEach(() => {
    
    ComplexQueryBuilder.fromQuery.mockReturnValue(new ComplexQueryBuilder());
            jest.spyOn(ComplexQueryBuilder.prototype, "whereEquals")
                .mockReturnThis();
            jest.spyOn(ComplexQueryBuilder.prototype, "whereRange")
                .mockReturnThis();
            jest.spyOn(ComplexQueryBuilder.prototype, "skip")
                .mockReturnThis();
            jest.spyOn(ComplexQueryBuilder.prototype, "limit")
                .mockReturnThis();
            jest.spyOn(ComplexQueryBuilder.prototype, "build")
                .mockReturnValue(query);
});


describe('Game controller tests', () => {
    describe('Create game tests', () => {
        
        test('Should return status code 201',  async () => {
            
            getIdFromAuthenticatedRequest.mockReturnValue('1')
            playerService.findPlayerById.mockReturnValue(Promise.resolve(mockPlayer))
            gameService.saveGame.mockReturnValue(Promise.resolve(mockGame))
            roomHandler.createGame.mockReturnValue(Promise.resolve(mockGame))
            await gameController.createGame(req,res,next).then(() => {  expect(res._status).toBe(201) })
            expect(playerService.findPlayerById).toHaveBeenCalledTimes(1);
            expect(gameService.saveGame).toHaveBeenCalledTimes(1);
            expect(roomHandler.createGame).toHaveBeenCalledTimes(1);

        });

        test('Should return status code 404 due to player not being found',  async () => {
            
            getIdFromAuthenticatedRequest.mockReturnValue('1')
            playerService.findPlayerById.mockReturnValue(Promise.resolve(null))
            try{
                await gameController.createGame(req,res,next);
            }
            catch (error){
                expect(error.statusCode).toBe(404)
            }

        });

        test('Should return status code 409 due to not being able to create the game',  async () => {
            
            getIdFromAuthenticatedRequest.mockReturnValue('1')
            playerService.findPlayerById.mockReturnValue(Promise.resolve(mockPlayer))
            gameService.saveGame.mockReturnValue(null)
            try{
                await gameController.createGame(req,res,next);
            }
            catch (error){
                expect(error.statusCode).toBe(409)
            }

        });
    });
    describe('Get game function', () => {
        test('Should return game mock', async() => {
            const req= {
                params:{
                    id: null
                }
            } 
            isValidId.mockReturnValue(true)
            gameService.findByGameId.mockReturnValue(Promise.resolve(mockGame))
            await gameController.getGame(req, res, next).then(() => {  expect(res._json).toBe(mockGame) })
            expect(isValidId).toHaveBeenCalledTimes(1);
            expect(gameService.findByGameId).toHaveBeenCalledTimes(1);
        });

        test('Should return 404 due to isValidId', async() => {
            const req= {
                params:{
                    id: null
                }
            } 
            isValidId.mockReturnValue(false)
            try{
                gameController.getGame(req, res, next)
            }
            catch(error){
                expect(error.statusCode).toBe(404)
            }
            
        });
        test('Should return 404 due to game not found', async() => {
            const req= {
                params:{
                    id: null
                }
            } 
            isValidId.mockReturnValue(false)
            gameService.findByGameId.mockReturnValue(Promise.resolve(null))
            try {
                await gameController.getGame(req, res, next)
            } catch(error) {
                expect(error.statusCode).toBe(404);
            }
            
        });
    });
    describe('Get games tests', () => {
        
        test('Should return list of games', async () => {
            const req = {
                query:{
                    offset: null,
                    limit: null
                }
            }
            whereRange.mockReturnValue(query);
            gameService.findGame.mockReturnValue(Promise.resolve(mockGame));
            const result= await gameController.getGames(req, res, next)
            expect(result).toBe(mockGame);
            expect(gameService.findGame).toHaveBeenCalledTimes(1);
        });

        test('Should return 404 due to invalid Id', () => {
            const req ={
                query: {
                    offset: 1,
                    limit: 1,
                    ownerId: 1
                }
            }
            try{
                gameController.getGames(req, res, next)
            } catch(error) {
                expect(error.statusCode).toBe(404)
            }
        });

    });
});
