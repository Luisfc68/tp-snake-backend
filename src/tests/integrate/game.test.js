const request = require('supertest');
const program = require('../app-mock')
const express = require('express')
const app= program.app
const server= program.server
let signedPlayer;
let token;
let signedGame;
jest.setTimeout('120000')

afterAll(done => {
    request(app)
        .delete('/players')
        .set('Authorization', 'Bearer ' + token)
    server.disconnect();
    done();
});
describe('Game API', () => {

    test('CreateGame', async () => {

        const signUpPlayer= { email: "testUser@gmail.com",password: "12345",username:"testUser"}
        await request(app)
        .post('/players ')
        .send(signUpPlayer).then((resp) => {
            signedPlayer=resp.body;
        });
        const sendBody = {
            email: signedPlayer.email,
            password: signUpPlayer.password}
        await request(app).post('/auth').send(sendBody).then((resp)=> {token= resp.body.accessToken})


        const sentPlayer= { id: signedPlayer.id}
        await request(app)
        .post('/games')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(201);
            expect(resp.body).toHaveProperty('owner');
            expect(resp.body).toHaveProperty('players');
            expect(resp.body).toHaveProperty('status');
            expect(resp.body).toHaveProperty('id');
            signedGame=resp.body;
        });

    });


    test('Get games list', async () => {
        await request(app)
        .get('/games')
        .set('Authorization', 'Bearer ' + token)
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(()=>{Array.isArray(res.body)}).toBeTruthy();
        });

    });

    test('Get game', async () => {
        await request(app)
        .get('/games/'+signedGame.id)
        .set('Authorization', 'Bearer ' + token)
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(JSON.stringify(resp.body)).toBe(JSON.stringify(signedGame));
        });
    });
})
