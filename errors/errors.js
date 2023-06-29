exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ status: err.status, msg: err.msg })
    } else next(err)
}
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "23503") {
        res.status(404).send({ status: 404, msg: "not found" })
    } else if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({ status: 400, msg: "bad request" })
    } else next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)

    res.status(500).send({ status: 500, msg: "Internal Server Error" })
}
