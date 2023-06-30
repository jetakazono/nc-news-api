const {
    deleteCommentById,
    updateVoteByCommentId,
} = require("../models/comments.model")

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params

    deleteCommentById(comment_id)
        .then((comment) => {
            res.status(204).send({ comment })
        })
        .catch((err) => {
            next(err)
        })
}

exports.patchVoteByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateVoteByCommentId(comment_id, inc_votes)
        .then((comment) => {
            res.status(200).send({ comment })
        })
        .catch((err) => {
            next(err)
        })
}
