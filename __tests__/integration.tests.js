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
    describe("FEATURE: GET /api/articles/:article_id (comment_count)", () => {
        test('GET: 200, should respond with an array containing a single object with given id and correct keys', () => {
            return request(app)
                .get("/api/articles/2")
                .expect(200)
                .then((response) => {
                    const { article } = response.body;
                    expect(article).toHaveProperty("comment_count");
                });
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
    describe("FEATURE REQUEST; /api/articles (queries)", () => {
        test("TOPIC: 200, should return an array of articles with queried topic", () => {
            return request(app)
                .get("/api/articles?topic=mitch")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    articles.forEach((article) => {
                        expect(article.topic).toBe('mitch');
                    });
                });
        });
        test("TOPIC: 200, should return an empty array when passed an topic which exists but has no articles", () => {
            return request(app)
                .get("/api/articles?topic=paper")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toEqual([]);
                });
        });

        test('TOPIC: 404, should return a 404: not found error if no matches for the topic query', () => {
            return request(app)
                .get("/api/articles?topic=FOOTIE!")
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe('Not found');
                });
        });
        test('SORT_BY: 200, returns articles sorted by queried column', () => {
            return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy("author", { descending: true });
                });
        });
        test('SORT_BY: 400, returns bad request when provided an invalid sort_by query', () => {
            return request(app)
                .get("/api/articles?sort_by=beers")
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Bad request, invalid sort query");
                });
        });
        test('ORDER: 200, returns articles in ascending order when queried', () => {
            return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy("created_at");
                });
        });
        test('ORDER: 400, returns bad request when provided an invalid order query', () => {
            return request(app)
                .get("/api/articles?order=yesplease")
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Bad request, invalid order query");
                });
        });
        test('TOPIC, ORDER and SORT', () => {
            return request(app)
                .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy("article_id");
                    articles.forEach((article) => () => {
                        expect(article.topic).toBe('mitch');
                    });
                });
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
});
describe('POST: /api/articles/:article_id/comments', () => {
    test('POST 201: should return 201, and a copy of the new object with a comment_id, timestamp and ', () => {
        const testObject = {
            body: "I'm a firestarter, twisted firestarter",
            author: "rogersop"
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(testObject)
            .expect(201)
            .then(({ body }) => {
                const { newComment } = body;
                expect(newComment).toHaveProperty("comment_id", 19);
                expect(newComment).toHaveProperty("body", "I'm a firestarter, twisted firestarter");
                expect(newComment).toHaveProperty("article_id", 2);
                expect(newComment).toHaveProperty("author", "rogersop");
                expect(newComment).toHaveProperty("votes", 0);
                expect(newComment).toHaveProperty("created_at");
            });
    });
    test("POST: 400, returns an error 400: Bad request when attempting to enter an invalid article_id", () => {
        const testObject = {
            body: "I'm a firestarter, twisted firestarter",
            author: "rogersop"
        };
        return request(app)
            .post("/api/articles/geoff8/comments")
            .send(testObject)
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Bad request");
            });
    });
    test("POST: 404, returns an error 404: Not found when attempting to add to an article that does not exist", () => {
        const testObject = {
            body: "I'm a firestarter, twisted firestarter",
            author: "rogersop"
        };
        return request(app)
            .post("/api/articles/23/comments")
            .send(testObject)
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Not found");
            });
    });
    test("POST: 400, returns 400: Bad request when providing no body or author", () => {
        return request(app)
            .post("/api/articles/23/comments")
            .send()
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Bad request");
            });
    });
});;
describe('PATCH /api/articles/:article_id', () => {
    test('PATCH: 200, should respond with updated object', () => {
        return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 35 })
            .expect(200)
            .then(({ body }) => {
                const updatedArticle = body;
                expect(updatedArticle).toHaveProperty("author", "icellusedkars");
                expect(updatedArticle).toHaveProperty("title", "Eight pug gifs that remind me of mitch");
                expect(updatedArticle).toHaveProperty("article_id", 3);
                expect(updatedArticle).toHaveProperty("body", "some gifs");
                expect(updatedArticle).toHaveProperty("topic", "mitch");
                expect(updatedArticle).toHaveProperty("created_at");
                expect(updatedArticle).toHaveProperty("votes", 35);
                expect(updatedArticle).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
            });
    });
    test('PATCH: 404, returns an error 404: Not found when passed a valid article_id  but it does not exist', () => {
        return request(app)
            .patch("/api/articles/24")
            .send({ inc_votes: 35 })
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Not found");
            });
    });
    test('PATCH: 400, returns 400: Bad request when passed an invalid article_id', () => {
        return request(app)
            .patch("/api/articles/rob")
            .send({ inc_votes: 35 })
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Bad request");
            });
    });
    test('PATCH: 400, returns 400: Bad request when passed something other than a number in inc_votes', () => {
        return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: "jim" })
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Bad request");
            });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test("204: Returns 204 and no content on successful delete", () => {
        return request(app)
            .delete("/api/comments/3")
            .expect(204)
            .then(() => db.query("SELECT * FROM comments WHERE comment_id = 3"))
            .then(({ rows }) => {
                expect(rows.length).toBe(0);
            });
    });
    test("400: Returns 400: Bad Request when passed an invalid parameter", () => {
        return request(app)
            .delete("/api/comments/hello")
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Bad request");
            });
    });
    test("404: Returns 404: Not found when passed a valid param, but does not exist", () => {
        return request(app)
            .delete("/api/comments/23")
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Not found");
            });
    });
});
describe('GET /api/users', () => {
    test("GET: 200 should respond with an array of objects upon GET /api/users", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(Array.isArray(users)).toBe(true);
            });
    });
    test("GET: 200 should respond with an array of data with correct keys and values", () => {
        return request(app)
            .get("/api/users")
            .then(({ body }) => {
                const { users } = body;
                expect(users.length).toEqual(4);
                users.forEach((user) => {
                    expect(user).toHaveProperty("username", expect.any(String));
                    expect(user).toHaveProperty("name", expect.any(String));
                    expect(user).toHaveProperty("avatar_url", expect.any(String));
                });
            });
    });
});




