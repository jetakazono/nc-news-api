const articlesRouter = require("express").Router()

const {
    getAllArticles,
    addNewArticle,
    getArticleById,
    getCommentsByArticleId,
    addCommentForAnArticle,
    patchArticleById,
} = require("../controllers/articles.controllers")

articlesRouter.route("/").get(getAllArticles).post(addNewArticle)

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticleById)
articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(addCommentForAnArticle)

module.exports = articlesRouter
