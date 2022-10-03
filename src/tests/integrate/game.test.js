const mongoose= require('mongoose');
const request = require('supertest');
const program = require('../../app')
const app= program.app
const server= program.server
let signedGame;
let token;


/*
    beforeEach(() => {
        await request(app)
        .post('/auth')
        .send({ email: "luis@gmail.com",password: "12345"}).then((resp) => {token= resp.body.accessToken;});
    });
afterAll(() => {
        server.disconnect();
    });
    */

   //describe('Game API', () => {
    /*
    test('SignUp', async () => {
        const sentPlayer= { id: signedPlayer.id}
        await request(app)
        .post('/game')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(201);
            expect(resp.body).toHaveProperty('owner');
            expect(resp.body).toHaveProperty('players');
            expect(resp.body).toHaveProperty('status');
            expect(resp.body.id).toHaveProperty('id');
            signedGame=resp.body;
        });

    });
    */

    /*
    test('Get', async () => {
        await request(app)
        .get('/game')
        .set('Authorization', 'Bearer ' + token)
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toBe(signedGame)
        });

    });
    */

    /*
    test('Get/', async () => {
        await request(app)
        .get('/game/'+signedGame.id)
        .set('Authorization', 'Bearer ' + token)
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toBe(signedGame)
        });

    });
    */
  // });