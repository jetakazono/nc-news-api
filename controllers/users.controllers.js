const {
    selectAllUsers,
    selectUserByUsername,
} = require("../models/users.models")

exports.getAllUsers = (_, res, next) => {
    selectAllUsers()
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params

    selectUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user })
        })
        .catch((err) => {
            next(err)
        })
}
