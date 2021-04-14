"use strict"

process.env.SECRET = "toes";

const supergoose = require('@code-fellows/supergoose');
const bearer = require('../src/auth-server/middleware/bearer.js');
const server = require('../src/server.js').server;
const request = supergoose(server);

const foods = {
    data: {
        name: `strawperry`,
        calories: '200',
        type: `FRUIT`,
    }
};
let id;
let token;


describe('V2 test', () => {
    it('create a user admin and get teh token', async() => {
        const response = await request
            .post('/signup')
            .send({ username: 'boodah96', password: '1223', role: 'admin' });
        const userObject = response.body;
        token = userObject.token;
        expect(userObject.token).toBeDefined();

    });

    it('POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item', async() => {
        let response = await request
            .post(`/api/v2/food`)
            .set('Authorization', `Bearer ${token}`)
            .send(foods.data);
        id = response.body._id;
        expect(response.status).toEqual(201);
        expect(response.body.name).toEqual(foods.data.name);
    });
    it('GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items', async() => {
        let response = await request
            .get(`/api/v2/food`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body[0].name).toEqual(foods.data.name);
    });
    it('GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID', async() => {
        let response = await request
            .get(`/api/v2/food/${id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(foods.data.name);
    });
    it('PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID', async() => {
        const update = {
            name: 'orange',
            calories: '100',
            type: 'FRUIT',

        }
        let response = await request
            .put(`/api/v2/food/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(update);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(update.name);
    });
    it('DELETE /api/v2/:model/ID with a bearer token that has delete', async() => {
        let response = await request
            .delete(`/api/v2/food/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(200);
    });

});