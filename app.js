const express = require("express")

const app = express()
const apiRouter = require("./routes/api-route")

const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
} = require("./errors/errors")

app.use(express.json())

app.use("/api", apiRouter)

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handleServerErrors)

module.exports = app
