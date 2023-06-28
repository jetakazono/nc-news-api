const express = require("express")

const { getEndpoints } = require("./controllers/api.controllers")
const { getAllTopics } = require("./controllers/topics.controllers")
const {
    getAllArticles,
    getArticleById,
    getCommentsByArticleId,
    addCommentForAnArticle,
} = require("./controllers/articles.controllers")
const { getAllUsers } = require("./controllers/users.controllers")
const {
    handleServerErrors,
    handlePsqlErrors,
    handleCustomErrors,
} = require("./errors/errors")

const app = express()

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", addCommentForAnArticle)

app.get("/api/users", getAllUsers)

app.all("*", (_, res) => {
    res.status(404).send({ msg: "not found" })
})

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handleServerErrors)

module.exports = app
