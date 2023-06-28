const { selectAllUsers } = require("../models/users.models")

exports.getAllUsers = (_, res, next) => {
    selectAllUsers()
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch((err) => {
            next(err)
        })
}
