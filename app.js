const express = require("express")

const { getEndpoints } = require("./controllers/api.controllers")
const { getAllTopics } = require("./controllers/topics.controller")
const {
    getAllArticles,
    getArticleById,
    getCommentsByArticleId,
} = require("./controllers/articles.controller")
const {
    handleServerErrors,
    handlePsqlErrors,
    handleCustomErrors,
} = require("./errors/errors")

const app = express()

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.all("*", (_, res) => {
    res.status(404).send({ msg: "not found" })
})

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handleServerErrors)

module.exports = app
