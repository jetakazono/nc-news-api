const topicsRouter = require("express").Router()

const { getAllTopics } = require("../controllers/topics.controllers")

topicsRouter.get("/", getAllTopics)

module.exports = topicsRouter
