const topicsRouter = require("express").Router()

const { getAllTopics } = require("../controllers/topics.controller")

topicsRouter.get("/", getAllTopics)

module.exports = topicsRouter
