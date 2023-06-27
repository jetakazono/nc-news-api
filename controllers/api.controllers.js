const fs = require("fs/promises")

exports.getEndpoints = (_, res, next) => {
    return fs
        .readFile(`${__dirname}/../endpoints.json`, "utf8")
        .then((endPoints) => {
            res.status(200).send({ endPoints: JSON.parse(endPoints) })
        })
        .catch((err) => {
            next(err)
        })
}
