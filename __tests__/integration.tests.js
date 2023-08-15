const testData = require('../db/data/test-data/index.js');
const request = require("supertest");
const db = require("../db/connection");
const { app } = require("../app.js");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

afterAll(() => {
    db.end();
});

beforeEach(() => {
    return seed(testData);
});


describe('GET /api/topics', () => {
    test("GET: 200 should respond with an array of objects upon GET /api/topics", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body)).toBe(true);
            });
    });
    test("GET: 200 should respond with an array of data with correct keys and values", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                const topics = response.body;
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty("description", expect.any(String));
                    expect(topic).toHaveProperty("slug", expect.any(String));
                });
            });
    });
    test("GET:200 should respond with array of correct length", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                const topics = response.body;
                expect(topics.length).toEqual(3);
            });
    });
});
describe("GET: /api", () => {
    test('GET: 200, should respond with 200 GET /api and a JSON object with the correct values', () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(typeof body).toBe("object");
                expect(body).toEqual(endpoints);
            });
    });
});
describe('ALL /notapath', () => {
    test('404: should respond with a 404 message if the path does not exist', () => {
        return request(app)
            .get("/api/something")
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Not Found");
            });
    });
});
