const mongoose= require('mongoose');
const request = require('supertest');
const program = require('../../app')
const app= program.app
const server= program.server
let signedPlayer;
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

    
    //describe('Player API', () => {
        
    /*
    test('SignUp', async () => {
        const sentPlayer= { email: "newUser@gmail.com",password: "12345",username:"newUser"}
        await request(app)
        .post('/players')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(201);
            expect(resp.body.username).toHaveProperty('username','newUser');
            expect(resp.body.email).toHaveProperty('email','newUser@gmail.com');
            expect(resp.body.id).toHaveProperty('id');
            signedPlayer=resp.body;
        });

    });
    */
   /*
    test('GetPlayer', async () => {
        await request(app)
        .get('/players/'+signedPlayer.id)
        .set('Authorization', 'Bearer ' + token)
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body.username).toHaveProperty('username','newUser');
            expect(resp.body.email).toHaveProperty('email','newUser@gmail.com');
            expect(resp.body.id).toHaveProperty('id');
            expect(resp.body).toBe(signedPlayer);
        });

    });
    */
   /*
    test('GetPlayers', async () => {
        await request(app)
        .get('/players')
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body.username).toHaveProperty('username','newUser');
            expect(resp.body.email).toHaveProperty('email','newUser@gmail.com');
            expect(resp.body.id).toHaveProperty('id');
            expect(resp.body).toBe(signedPlayer);
        });

    });
    */
   /*
    test('Set Image', async () => {
        const sentPlayer= { image: '../image/descarga.jpg'}
        await request(app)
        .put('/players/images')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(204);
        });

    });
    */
   /*
    test('Get Image', async () => {
        await request(app)
        .get('/players/images')
        .set('Authorization', 'Bearer ' + token).then((resp) => {
            expect(resp.statusCode).toBe(200);
        });

    });
    */
   /*
    test('Edit', async () => {
        const sentPlayer= { email: "updateUser@gmail.com",password: "12345",username:"updateUser"}
        await request(app)
        .put('/players')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(204);
        });

    });
    */
   /*
    test('Delete', async () => {
        const sentPlayer= { id: signedPlayer.id}
        await request(app)
        .delete('/players')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body.username).toHaveProperty('username','updateUser');
            expect(resp.body.email).toHaveProperty('email','updateUser@gmail.com');
            expect(resp.body.id).toHaveProperty('id');
            expect(resp.body).toBe(signedPlayer);
        });

    });
    
   
});
*/
//});
