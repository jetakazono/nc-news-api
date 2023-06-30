const articlesRouter = require("express").Router()

const {
    getAllArticles,
    addNewArticle,
    getArticleById,
    getCommentsByArticleId,
    addCommentForAnArticle,
    patchArticleById,
    removeArticleById,
} = require("../controllers/articles.controllers")

articlesRouter.route("/").get(getAllArticles).post(addNewArticle)

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleById)
    .delete(removeArticleById)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(addCommentForAnArticle)

module.exports = articlesRouter
