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
                expect(article).toHaveProperty("topic");
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
describe('/api/articles', () => {
    test('GET: 200, responds with an array of article objects of correct length, with correct properties ', () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBe(13);
                articles.forEach((article) => {
                    expect(article).toHaveProperty("author");
                    expect(article).toHaveProperty("title");
                    expect(article).toHaveProperty("article_id");
                    expect(article).toHaveProperty("topic");
                    expect(article).toHaveProperty("created_at");
                    expect(article).toHaveProperty("votes");
                    expect(article).toHaveProperty("article_img_url");
                    expect(article).toHaveProperty("comment_count");
                });
            });
    });
    test('GET:200, results should be listed in decending order by date', () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSortedBy('created_at', { descending: true });
            });
    });
});
describe('/api/articles/:article_id/comments', () => {
    test('GET 200: responds with an array of all comments for given article_id', () => {
        return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then((response) => {
                const { comments } = response.body;
                expect(comments.length).toBe(2);
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id");
                    expect(comment).toHaveProperty("votes");
                    expect(comment).toHaveProperty("created_at");
                    expect(comment).toHaveProperty("author");
                    expect(comment).toHaveProperty("body");
                    expect(comment).toHaveProperty("article_id");
                });
                expect(comments).toBeSortedBy('created_at', { descending: true });
            });
    });
    test("GET: 200, returns an empty array when given a valid article but has no comments", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then((response) => {
                const { comments } = response.body;
                expect(comments).toEqual([]);
            });
    });
    test("GET: 400, returns an error 400: Bad request when passed an invalid query", () => {
        return request(app)
            .get("/api/articles/dave/comments")
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Bad request");
            });
    });
    test("GET: 404, returns an error 404: Not found when passed a valid query but it does not exist", () => {
        return request(app)
            .get("/api/articles/24/comments")
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Not found");
            });
    });
})


