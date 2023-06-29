const usersRouter = require("express").Router()

const { getAllUsers } = require("../controllers/users.controllers")

usersRouter.get("/", getAllUsers)

module.exports = usersRouter
