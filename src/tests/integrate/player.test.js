const request = require('supertest');
const program = require('../app-mock')
const app= program.app
const server= program.server
let signedPlayer;
let token;
    
afterAll(async() => {
    await request(app)
        .delete('/players')
        .set('Authorization', 'Bearer ' + token)
    await server.disconnect();
});
describe('Player API', () => {
        
    test('SignUp', async () => {
        const sentPlayer= { email: "newUser@gmail.com",password: "12345",username:"newUser"}
        await request(app)
        .post('/players')
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(201);
            expect(resp.body).toHaveProperty('username');
            expect(resp.body).toHaveProperty('email');
            expect(resp.body).toHaveProperty('id');
            signedPlayer=resp.body;
        });
        const sendBody = {
            email: signedPlayer.email,
            password: sentPlayer.password}
        await request(app).post('/auth').send(sendBody).then((resp)=> {token= resp.body.accessToken})

    });
    test('GetPlayer', async () => {
        await request(app)
        .get('/players/'+ signedPlayer.id)
        .set('Authorization', 'Bearer ' + token)
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toHaveProperty('username','newUser');
            expect(resp.body).toHaveProperty('email','newUser@gmail.com');
            expect(resp.body).toHaveProperty('id');
            expect(JSON.stringify(resp.body)).toBe(JSON.stringify(signedPlayer));
        });

    });
    test('GetPlayers', async () => {
        await request(app)
        .get('/players')
        .set('Authorization', 'Bearer ' + token)
        .then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(()=>{Array.isArray(res.body)}).toBeTruthy();
        });

    });
    test('Set Image', async () => {

        await request(app)
        .put('/players/images')
        .set('Authorization', 'Bearer ' + token)
        .attach('image',`${__dirname}\\image\\descarga.jpg`)
        .then((resp) => {
            expect(resp.statusCode).toBe(204);
        })

    });
    test('Get Image', async () => {
        

        await request(app)
        .get(`/players/images/${signedPlayer.id}`)
        .set('Authorization', 'Bearer ' + token).then((resp) => {
            expect(resp.statusCode).toBe(200);
        });

    });

    test('Edit', async () => {
        const sentPlayer= { email: "updateUser@gmail.com",password: "12345",username:"updateUser"}
        await request(app)
        .put('/players')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(204);
        });

    });

    test('Delete', async () => {
        const sentPlayer= { id: signedPlayer.id}
        await request(app)
        .delete('/players')
        .set('Authorization', 'Bearer ' + token)
        .send(sentPlayer).then((resp) => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toHaveProperty('username','updateUser');
            expect(resp.body).toHaveProperty('email','updateUser@gmail.com');
            expect(resp.body).toHaveProperty('id');
        });

    });
    
   
});
