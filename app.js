const express = require("express")

const { getEndpoints } = require("./controllers/api.controllers")
const { getAllTopics } = require("./controllers/topics.controller")
const { handleServerErrors } = require("./errors/errors")

const app = express()

app.get("/api", getEndpoints)

app.get("/api/topics", getAllTopics)

app.all("*", (_, res) => {
    res.status(404).send({ msg: "not found" })
})

app.use(handleServerErrors)

module.exports = app
