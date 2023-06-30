const topicsRouter = require("express").Router()

const { getAllTopics, addTopics } = require("../controllers/topics.controllers")

topicsRouter.route("/").get(getAllTopics).post(addTopics)

module.exports = topicsRouter
