const { selectAllTopics, insertTopic } = require("../models/topics.models")

exports.getAllTopics = (_, res, next) => {
    selectAllTopics()
        .then((topics) => {
            res.status(200).send({ topics })
        })
        .catch((err) => {
            next(err)
        })
}

exports.addTopics = (req, res, next) => {
    const { slug, description } = req.body

    insertTopic(slug, description)
        .then((topic) => {
            res.status(201).send({ topic })
        })
        .catch((err) => {
            next(err)
        })
}
