const express = require("express")
const app = express()
const {
    handleServerErrors,
    handlePsqlErrors,
    handleCustomErrors,
} = require("./errors/errors")

const apiRouter = require(`./routes/api-router`)

app.use(express.json())

app.use("/api", apiRouter)

app.all("*", (_, res) => {
    res.status(404).send({ msg: "not found" })
})

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handleServerErrors)

module.exports = app
