"use strict"

process.env.SECRET = "toes";
const mongoose = require('mongoose');
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../src/auth-server/middleware/bearer.js');
const server = require('../src/server.js').server;
const request = supergoose(server);

let id;

describe('V1 test', () => {
    const foods = {
        route: 'food',
        data: {
            name: `strawperry`,
            calories: '200',
            type: `FRUIT`,
        }
    };


    it('POST /api/v1/:model adds an item to the DB and returns an object with the added item', async() => {
        let response = await request
            .post(`/api/v1/${foods.route}`)
            .send(foods.data);
        id = response.body._id;
        expect(response.status).toEqual(201);
        expect(response.body.name).toEqual(foods.data.name);
    });
    it('GET /api/v1/:model returns a list of :model items', async() => {
        let response = await request.get(`/api/v1/${foods.route}`);
        expect(response.status).toEqual(200);
        expect(response.body[0].name).toEqual(foods.data.name);
    });
    it('GET /api/v1/:model/ID returns a single item by ID', async() => {
        let response = await request.get(
            `/api/v1/${foods.route}/${id}`
        );
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(foods.data.name);
    });
    it('PUT /api/v1/:model/ID returns a single, updated item by ID', async() => {
        const update = {
            name: 'orange',
            calories: '100',
            type: 'FRUIT',

        }
        let response = await request
            .put(`/api/v1/${foods.route}/${id}`)
            .send(update);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(update.name);
    });
    it('DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found', async() => {
        let response = await request.delete(
            `/api/v1/${foods.route}/${id}`
        );
        expect(response.status).toEqual(200);
    });
});