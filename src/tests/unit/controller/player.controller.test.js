const { isValidId, ComplexQueryBuilder } = require('../../../utils/db');
const { getIdFromAuthenticatedRequest } = require('../../../utils/controller.utils');
const { saveImage, getImage } = require('../../../utils/fileSystem.utils');
const playerService = require('../../../services/players.service');
const playerController= require('../../../controllers/players.controller')
let {req,res,next} = require('../../__mocks__/expressObjectMocks')
let mockPlayer = require('../../__mocks__/playerMocks')

jest.mock('../../../services/players.service.js')
jest.mock('../../../utils/db')
jest.mock('../../../utils/fileSystem.utils')
jest.mock('../../../utils/controller.utils')


describe('Player controller tests', () => {
    
    describe('Sign up tests', () => {
        
        test('should return player and status 201', async () => {
            req= {
                body:{
                    email: 'mail@gmail.com',
                    username: 'username',
                    password: 'password'
                }
            }
            playerService.validatePlayer.mockReturnValue(Promise.resolve(req.body))
            playerService.findPlayer.mockReturnValue('')
            playerService.savePlayer.mockReturnValue(Promise.resolve(req.body))

            const result= await playerController.signUp(req,res,next)
            expect(playerService.validatePlayer).toHaveBeenCalledTimes(1);
            expect(playerService.findPlayer).toHaveBeenCalledTimes(1);
            expect(result._status).toBe(201)
            expect(result._json).toBe(req.body);

        });
        test('should return 409 due to signing up with an existing email', async() => {
            //TODO
            const req= {
                body:{
                    email: 'mail@gmail.com',
                    username: 'username',
                    password: 'password'
                }
            }
            
            playerService.validatePlayer.mockReturnValue(Promise.resolve(req.body))
            playerService.findPlayer.mockReturnValue(Promise.resolve('value'))
            try {
                await playerController.signUp(req,res,next)
            } catch (error) {
                expect(error.statusCode).toBe(409);
            } 
        });        
    });
    describe('Get player', () => {
        test('should return mocked player ', async() => {
            const req= {
                params:{
                    id: null
                }
            } 
            isValidId.mockReturnValue(true)
            playerService.findPlayerById.mockReturnValue(Promise.resolve(mockPlayer))

            await playerController.getPlayer(req,res,next)
            expect(isValidId).toHaveBeenCalledTimes(1);
            expect(playerService.findPlayerById).toHaveBeenCalledTimes(1);

        });

        test('should return 404 due to inValid Id ', async() => {
            const req= {
                params:{
                    id: null
                }
            } 
            isValidId.mockReturnValue(false)
            try{
                await playerController.getPlayer(req,res,next)
            }
            catch (error){
                expect(error.statusCode).toBe(404)
            }
        });
        test('should return 404 due to not being able to find the player ', async() => {
            const req= {
                params:{
                    id: null
                }
            } 
            isValidId.mockReturnValue(false)
            playerService.findPlayerById.mockReturnValue(Promise.resolve(null))
            try{
                await playerController.getPlayer(req,res,next)
            }
            catch (error){
                expect(error.statusCode).toBe(404)
            }
        });
    });
    describe('Delete player test', () => {
        
        test('should return the player eliminated', () => {

            getIdFromAuthenticatedRequest.mockReturnValue(1)
            playerService.deletePlayer.mockReturnValue(Promise.resolve(mockPlayer))

            playerController.deletePlayer(req,res,next)
            expect(getIdFromAuthenticatedRequest).toHaveBeenCalledTimes(1);
            expect(playerService.deletePlayer).toHaveBeenCalledTimes(1);
        });

        test('should return 404 due to not being able to find the player', async() => {

            getIdFromAuthenticatedRequest.mockReturnValue(Promise.resolve(1))
            playerService.deletePlayer.mockReturnValue(Promise.resolve(null))
            try {
                await playerController.deletePlayer(req,res,next)
            } catch (error) {
                expect(error._status).toBe(404);
            }

        });
    });
    describe('Update player tests', () => {
        
        test('should return 204', () => {
            const req= {
                body:{
                    email: 'mail@gmail.com',
                    username: 'username',
                    password: 'password',

                    
                }
            }
            const findPlayer= {
                id: 2,
                some: ()=>{
                    return null
                }
            }
            getIdFromAuthenticatedRequest.mockReturnValue(1)
            playerService.validatePlayer.mockReturnValue(Promise.resolve(req.body))
            playerService.findPlayer.mockReturnValue(Promise.resolve(findPlayer))
            playerService.updatePlayer.mockReturnValue(Promise.resolve(req.body))

            playerController.updatePlayer(req,res,next)
            
            expect(getIdFromAuthenticatedRequest).toHaveBeenCalledTimes(1);
            expect(playerService.validatePlayer).toHaveBeenCalledTimes(1);            
        });

        test('should return 409 due to wanting to update the player with an existing mail', async() => {
            const req= {
                body:{
                    email: 'mail@gmail.com',
                    username: 'username',
                    password: 'password'
                }
            }
            const findPlayer= {
                id: 2,
                some: ()=>{
                    return this
                }
            }
            getIdFromAuthenticatedRequest.mockReturnValue(1)
            playerService.validatePlayer.mockReturnValue(Promise.resolve(req.body))
            playerService.findPlayer.mockReturnValue(Promise.resolve(findPlayer))

            try {
                await playerController.updatePlayer(req,res,next)
            } catch (error) {
                expect(error.statusCode).toBe(409);
            }  
        });
        test('should return 404 due to not being able to update player', async () => {
            const req= {
                body:{
                    email: 'mail@gmail.com',
                    username: 'username',
                    password: 'password'
                }
            }
            const findPlayer= {
                id: 2,
                some: ()=>{
                    return null
                }
            }
            getIdFromAuthenticatedRequest.mockReturnValue(1)
            playerService.validatePlayer.mockReturnValue(Promise.resolve(req.body))
            playerService.findPlayer.mockReturnValue(Promise.resolve(findPlayer))
            playerService.updatePlayer.mockReturnValue(Promise.resolve(undefined))
            try {
                await playerController.updatePlayer(req,res,next)
            } catch (error) {
                expect(error.statusCode).toBe(404);
            }  
        });
    });
    describe('Upload player image test', () => {
        test('should return 204', () => {
            getIdFromAuthenticatedRequest.mockReturnValue(1)
            saveImage.mockReturnValue(Promise.resolve(null))
            playerController.uploadPlayerImage(req,res,next)
            expect(getIdFromAuthenticatedRequest).toHaveBeenCalledTimes(1);
            expect(saveImage).toHaveBeenCalledTimes(1);



        });
    });

    describe('Get player image test', () => {
        test('should return 404', () => {
            const req= {
                params:{
                    id: null
                }
            } 
            getImage.mockReturnValue(Promise.resolve({}))
            playerController.getPlayerImage(req,res,next)
            expect(getImage).toHaveBeenCalledTimes(1);
        });
        test('should return 404 due to not finding players image', async() => {
            const req= {
                params:{
                    id: null
                }
            } 
            getImage.mockReturnValue(Promise.resolve(false))
            try {
                await playerController.getPlayerImage(req,res,next)
            } catch (error) {
                console.log(error)
                expect(error.statusCode).toBe(404);
            }
            
        });
    });
});