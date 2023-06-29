const { deleteCommentById } = require("../models/comments.model")

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params

    deleteCommentById(comment_id)
        .then((comment) => {
            res.status(204).send()
        })
        .catch((err) => {
            next(err)
        })
}
