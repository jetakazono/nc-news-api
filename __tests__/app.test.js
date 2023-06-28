const request = require("supertest")
const seed = require("../db/seeds/seed")

const testData = require("../db/data/test-data")
const app = require("../app")
const db = require("../db/connection")
const endPointsFile = require("../endpoints.json")
const { forEach } = require("../db/data/test-data/comments")

beforeEach(() => seed(testData))

afterAll(() => db.end())

describe("GET /api/", () => {
    test("status: 200 - should resolve with an object describing all the available API endpoints ", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                const { endPoints } = body

                expect(Object.keys(endPoints)).toHaveLength(
                    Object.keys(endPointsFile).length
                )
                expect(typeof endPoints).toBe("object")
                expect(endPoints).toEqual(endPointsFile)
                expect(
                    Object.values(endPoints).forEach((endpoint) => {
                        if (!endPoints["GET /api"]) {
                            expect(endpoint).toMatchObject({
                                description: expect.any(String),
                                queries: expect.any(Array),
                                exampleResponse: expect.any(Object),
                            })
                        }
                    })
                )
            })
    })
    test("status: 404 - when given an invalid endpoint", () => {
        return request(app)
            .get("/apiInvalid")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("GET:/api/topics", () => {
    test("status: 200 - should responds with topics array, each topic should have the correct keys", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const { topics } = body

                expect(topics).toBeInstanceOf(Array)
                expect(topics).toHaveLength(3)

                topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug"), expect.any(String)
                    expect(topic).toHaveProperty("description"),
                        expect.any(String)
                })
            })
    })
})
describe("GET /api/articles", () => {
    test("status: 200 - should responds with an articles array of article objects, each of which should have the correct keys, the objects should be sorted by date in descending order by default", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                })
                expect(articles).toHaveLength(13)

                articles.forEach((article) => {
                    expect(article).toHaveProperty("author"), expect.any(String)
                    expect(article).toHaveProperty("title"), expect.any(String)
                    expect(article).toHaveProperty("article_id"),
                        expect.any(Number)
                    expect(article).toHaveProperty("topic"), expect.any(String)
                    expect(article).toHaveProperty("created_at"),
                        expect.any(Number)
                    expect(article).toHaveProperty("votes"), expect.any(Number)
                    expect(article).toHaveProperty("article_img_url"),
                        expect.any(String)
                    expect(article).toHaveProperty("comment_count"),
                        expect.any(Number)
                })
            })
    })
})
describe("GET /api/articles/:article_id", () => {
    test("status: 200, - should responds with an article object, which should have the correct keys", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                const { article } = body
                expect(typeof article).toBe("object")
                expect(article).toHaveProperty("article_id", expect.any(Number))
                expect(article).toHaveProperty("author", expect.any(String))
                expect(article).toHaveProperty("title", expect.any(String))
                expect(article).toHaveProperty("body", expect.any(String))
                expect(article).toHaveProperty("topic", expect.any(String))
                expect(article).toHaveProperty("created_at", expect.any(String))
                expect(article).toHaveProperty("votes", expect.any(Number))
                expect(article).toHaveProperty(
                    "article_img_url",
                    expect.any(String)
                )
            })
    })
    test("status: 400 - should responds with bad request when article_id is an invalid type", () => {
        return request(app)
            .get("/api/articles/NaN")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 404 - should responds not found when article_id is a non existent id", () => {
        return request(app)
            .get("/api/articles/88888888")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("should responds with an array of comments for the given article_id of which each comment should have the correct keys and comments should be sorted by the most recent comments", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body
                expect(comments).toBeInstanceOf(Array)
                expect(comments).toBeSortedBy("created_at", {
                    descending: true,
                })
                expect(comments).toHaveLength(11)
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id"),
                        expect.any(Number)
                    expect(comment).toHaveProperty("votes"), expect.any(Number)
                    expect(comment).toHaveProperty("created_at"),
                        expect.any(String)
                    expect(comment).toHaveProperty("author"), expect.any(String)
                    expect(comment).toHaveProperty("body"), expect.any(String)
                    expect(comment).toHaveProperty("article_id"),
                        expect.any(Number)
                })
            })
    })
    test("status: 200 - should responds with an empty array for article that has no comments", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toHaveLength(0)
            })
    })
    test("status: 400 - should responds with bad request when article_id is an invalid type", () => {
        return request(app)
            .get("/api/articles/NaN/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 404 - should responds not found when article_id is a non existent id", () => {
        return request(app)
            .get("/api/articles/88888888/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("POST /api/articles/:article_id/comments", () => {
    test("status: 201 - should responds with the posted comment", () => {
        const testComment = {
            username: "butter_bridge",
            body: "a new comment",
        }
        return request(app)
            .post("/api/articles/11/comments")
            .send(testComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body

                expect(typeof comment).toBe("object")
                expect(Object.keys(comment)).toHaveLength(6)
                expect(comment).toMatchObject({
                    comment_id: 19,
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                })
            })
    })
    test("status: 201 - should ignore unnecessary properties given", () => {
        const testComment = {
            username: "butter_bridge",
            body: "a new comment",
            unnecessaryProperty: "unnecessary",
        }
        return request(app)
            .post("/api/articles/11/comments")
            .send(testComment)
            .expect(201)
    })
    test("status: 400 - should responds with bad request when article_id is an invalid type", () => {
        const testComment = {
            username: "butter_bridge",
            body: "a new comment",
        }
        return request(app)
            .post("/api/articles/NaN/comments")
            .send(testComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should responds with bad request when required values is not given", () => {
        const testComment = {
            username: "butter_bridge",
        }
        return request(app)
            .post("/api/articles/1/comments")
            .send(testComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status 404 - should responds with not found when username is an a non existent user", () => {
        const testComment = {
            username: "obi",
            body: "a new comment",
        }
        return request(app)
            .post("/api/articles/1/comments")
            .send(testComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
    test("status: 404 - should responds with not found when article_id is a non existent id", () => {
        const testComment = {
            username: "butter_bridge",
            body: "a new comment",
        }
        return request(app)
            .post("/api/articles/888888/comments")
            .send(testComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
