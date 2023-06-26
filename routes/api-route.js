const apiRouter = require("express").Router()

const topicsRouter = require("./topics-route")

apiRouter.use("/topics", topicsRouter)

module.exports = apiRouter
