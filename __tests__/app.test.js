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
                    expect(article).toHaveProperty("article_id"), expect.any(Number)
                    expect(article).toHaveProperty("topic"), expect.any(String)
                    expect(article).toHaveProperty("created_at"), expect.any(Number)
                    expect(article).toHaveProperty("votes"), expect.any(Number)
                    expect(article).toHaveProperty("article_img_url"), expect.any(String)
                    expect(article).toHaveProperty("comment_count"), expect.any(Number)
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
                expect(body.msg).toBe("article not found")
            })
    })
})
