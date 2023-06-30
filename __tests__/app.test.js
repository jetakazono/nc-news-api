const request = require("supertest")
const seed = require("../db/seeds/seed")

const testData = require("../db/data/test-data")
const app = require("../app")
const db = require("../db/connection")
const endPointsFile = require("../endpoints.json")

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
})
describe("ALL non-existent path", () => {
    test("status: 404 - should return a custom error message when the path is not found", () => {
        return request(app)
            .get("/invalidPath")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("GET /api/topics", () => {
    test("status: 200 - should respond with topics array, each topic should have the correct keys", () => {
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
    test("status: 200 - should respond with an articles array of article objects, each of which should have the correct keys, the objects should be sorted by date in descending order by default", () => {
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
    test("status: 200 - should accept topic query, which filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles", () => {
        return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(1)

                articles.forEach((article) => {
                    expect(article.topic).toBe("cats")
                })
            })
    })
    test("status: 200 - should accept queries, which filters the articles by the topic and order by ascending or descending a specific column", () => {
        return request(app)
            .get("/api/articles?topic=mitch&sort_by=author")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(12)

                articles.forEach((article) => {
                    expect(article.topic).toBe("mitch")
                })
            })
    })
    test("status: 200 - should respond with an empty object when given a valid topic but has no articles", () => {
        return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(0)
            })
    })
    test("status: 200 - should accept sort_by query, which sorts the articles by any valid column defaults to date", () => {
        return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(13)
                expect(articles).toBeSortedBy("votes", {
                    descending: true,
                })
            })
    })
    test("status: 200 - should accept order query, which can be set to asc or desc for ascending or descending. Defaults to descending", () => {
        return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(13)
                expect(articles).toBeSortedBy("created_at")
            })
    })
    test("status: 200 - should accept multiples queries, which can be set for ascending or descending a specific column", () => {
        return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(13)
                expect(articles).toBeSortedBy("title")
            })
    })
    test("status: 200 - should accept multiples queries, which can filter the articles by the topic and set for ascending or descending a specific column", () => {
        return request(app)
            .get("/api/articles?topic=mitch&sort_by=author&order=asc")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(12)
                expect(articles).toBeSortedBy("author")
            })
    })
    test("status: 200 - should ignore unnecessary queries given and consider only valid ones", () => {
        return request(app)
            .get(
                "/api/articles?topic=mitch&sort_by=author&unnecessary=unnecessary&order=asc&unnecessary=unnecessary"
            )
            .expect(200)
            .then(({ body }) => {
                const { articles } = body

                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(12)
                expect(articles).toBeSortedBy("author")
            })
    })
    test("status: 400 - should respond with bad request when topic given is an invalid type", () => {
        return request(app)
            .get("/api/articles?topic=88888")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should respond with bad request when sort_by is an invalid column ", () => {
        return request(app)
            .get("/api/articles?sort_by=invalidColumn")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should respond with bad request when order given is an invalid value", () => {
        return request(app)
            .get("/api/articles?order=ASCENDING")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should respond with bad request when order given is an invalid type", () => {
        return request(app)
            .get("/api/articles?order=8888")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 404 - should respond with not found when topic is a non existent topic", () => {
        return request(app)
            .get("/api/articles?topic=invalidTopic")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("GET /api/articles/:article_id", () => {
    test("status: 200, - should respond with an article object, which should have the correct keys", () => {
        return request(app)
            .get("/api/articles/3")
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
                expect(article).toHaveProperty(
                    "comment_count",
                    expect.any(String)
                )
                expect(article.comment_count).toBe("2")
            })
    })
    test("status: 400 - should respond with bad request when article_id is an invalid type", () => {
        return request(app)
            .get("/api/articles/NaN")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 404 - should respond not found when article_id is a non existent id", () => {
        return request(app)
            .get("/api/articles/88888888")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("GET /api/articles/:article_id/comments", () => {
    test("should respond with an array of comments for the given article_id of which each comment should have the correct keys and comments should be sorted by the most recent comments", () => {
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
    test("status: 200 - should respond with an empty array for article that has no comments", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toHaveLength(0)
            })
    })
    test("status: 400 - should respond with bad request when article_id is an invalid type", () => {
        return request(app)
            .get("/api/articles/NaN/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 404 - should respond not found when article_id is a non existent id", () => {
        return request(app)
            .get("/api/articles/88888888/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("POST /api/articles/:article_id/comments", () => {
    test("status: 201 - should respond with the posted comment", () => {
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
    test("status: 400 - should respond with bad request when article_id is an invalid type", () => {
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
    test("status: 400 - should respond with bad request when comment_id is an invalid type", () => {
        return request(app)
            .delete("/api/comments/NaN")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should respond with bad request when required values is not given", () => {
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
    test("status 404 - should respond with not found when username is an a non existent user", () => {
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
    test("status: 404 - should respond with not found when article_id is a non existent id", () => {
        const testComment = {
            username: "butter_bridge",
            body: "a new comment",
        }
        return request(app)
            .post("/api/articles/888888/comments")
            .send(testComment)
    })
})
describe("DELETE /api/comments/:comment_id", () => {
    test("status: 204 - delete the given comment by comment_id", () => {
        return request(app).delete("/api/comments/1").expect(204)
    })
    test("status: 404 - should respond not found when comment_id is a non existent id", () => {
        return request(app)
            .delete("/api/comments/888888")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("POST /api/articles", () => {
    test("status: 201 - should add a new article and responds with the newly added article", () => {
        const testNewArticle = {
            author: "icellusedkars",
            title: "test title",
            body: "test body",
            topic: "paper",
            article_img_url: "test article img url link",
            unnecessaryProperty: "unnecessary",
        }
        return request(app)
            .post("/api/articles")
            .send(testNewArticle)
            .expect(201)
            .then(({ body }) => {
                const { article } = body

                expect(article).toBeInstanceOf(Object)
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: testNewArticle.title,
                    topic: testNewArticle.topic,
                    author: testNewArticle.author,
                    body: testNewArticle.body,
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: testNewArticle.article_img_url,
                })
            })
    })
    test("status: 201 - should ignore unnecessary properties given and consider only valid ones ", () => {
        const testNewArticle = {
            author: "icellusedkars",
            title: "test title",
            body: "test body",
            topic: "paper",
            article_img_url: "test article img url link",
            unnecessaryProperty: "unnecessary",
        }
        return request(app)
            .post("/api/articles")
            .send(testNewArticle)
            .expect(201)
            .then(({ body }) => {
                const { article } = body

                expect(article).toBeInstanceOf(Object)
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: testNewArticle.title,
                    topic: testNewArticle.topic,
                    author: testNewArticle.author,
                    body: testNewArticle.body,
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: testNewArticle.article_img_url,
                })
            })
    })
    test("status: 400 - should respond with bad request when required values are not given", () => {
        const testNewArticle = {
            body: "test body",
            article_img_url: "test article img url link",
        }
        return request(app)
            .post("/api/articles")
            .send(testNewArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should respond with bad request when author is an invalid type", () => {
        const testNewArticle = {
            author: 88888,
            title: "test title",
            body: "test body",
            topic: "paper",
            article_img_url: "test article img url link",
        }
        return request(app)
            .post("/api/articles")
            .send(testNewArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should respond with bad request when topic is an invalid type", () => {
        const testNewArticle = {
            author: "icellusedkars",
            title: "test title",
            body: "test body",
            topic: 88888,
            article_img_url: "test article img url link",
        }
        return request(app)
            .post("/api/articles")
            .send(testNewArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 404 - should respond with not found when author given is a non existent user", () => {
        const testNewArticle = {
            author: "Obi",
            title: "test title",
            body: "test body",
            topic: "paper",
            article_img_url: "test article img url link",
        }
        return request(app)
            .post("/api/articles")
            .send(testNewArticle)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
    test("status: 404 - should respond with not found when topic given is a non existent topic", () => {
        const testNewArticle = {
            author: "icellusedkars",
            title: "test title",
            body: "test body",
            topic: "dog",
            article_img_url: "test article img url link",
        }
        return request(app)
            .post("/api/articles")
            .send(testNewArticle)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("PATCH /api/articles/:article_id", () => {
    test("status: 200 - should increment an article votes by input given when it is a positive number and respond with the updated article", () => {
        const testUpdateVotes = { inc_votes: 1 }

        return request(app)
            .patch("/api/articles/1")
            .send(testUpdateVotes)
            .expect(200)
            .then(({ body }) => {
                const { article } = body

                expect(typeof article).toBe("object")
                expect(Object.keys(article)).toHaveLength(8)
                expect(article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 101,
                    article_img_url: expect.any(String),
                })
            })
    })
    test("status: 200 - should decrement an article votes by input given when it is a negative number and respond with the updated article", () => {
        const testUpdateVotes = { inc_votes: -100 }

        return request(app)
            .patch("/api/articles/1")
            .send(testUpdateVotes)
            .expect(200)
            .then(({ body }) => {
                const { article } = body

                expect(typeof article).toBe("object")
                expect(Object.keys(article)).toHaveLength(8)
                expect(article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 0,
                    article_img_url: expect.any(String),
                })
            })
    })
    test("status: 400 - should respond with bad request when required value is not given ", () => {
        const testUpdateVotes = {}

        return request(app)
            .patch("/api/articles/1")
            .send(testUpdateVotes)
            .expect(400)
            .send({})
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 400 - should respond with bad request when article_id is an invalid type", () => {
        const testUpdateVotes = { inc_votes: 10 }

        return request(app)
            .patch("/api/articles/NaN")
            .send(testUpdateVotes)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("status: 404 - should respond not found when article_id is a non existent id", () => {
        const testUpdateVotes = { inc_votes: 10 }

        return request(app)
            .patch("/api/articles/88888888")
            .send(testUpdateVotes)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("GET /api/users", () => {
    test("status: 200 - should respond with an array of objects, each object should have the correct keys", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                const { users } = body

                expect(users).toBeInstanceOf(Array)
                expect(users).toHaveLength(4)
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    })
                })
            })
    })
})
