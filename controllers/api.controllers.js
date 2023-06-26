const { readEndpoints } = require("../models/api.models")

exports.getEndpoints = (_, res, next) => {
    readEndpoints()
        .then((endpoints) => {
            res.status(200).send({ endpoints })
        })
        .catch((err) => {
            next(err)
        })
}

