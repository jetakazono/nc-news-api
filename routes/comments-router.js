const commentsRouter = require("express").Router()

const {
    removeCommentById,
    patchVoteByCommentId,
} = require("../controllers/comments.controllers")

commentsRouter
    .route("/:comment_id")
    .delete(removeCommentById)
    .patch(patchVoteByCommentId)

module.exports = commentsRouter
