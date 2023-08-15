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
describe("/api/articles/:article_id", () => {
    test('GET: 200, should respond with an array containing a single object with given id and correct keys', () => {
        return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then((response) => {
                const { article } = response.body;
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id", 2);
                expect(article).toHaveProperty("body");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
            });
    });
    test('GET: 400, should respond with 400: Bad request if passed something other than a number as params', () => {
        return request(app)
            .get("/api/articles/cake4")
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Bad request");
            });
    });
    test("GET: 404, should respond with 404: Not found if passed a valid parameter but it doesn't exist", () => {
        return request(app)
            .get("/api/articles/15")
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Not found");
            });
    });
});
