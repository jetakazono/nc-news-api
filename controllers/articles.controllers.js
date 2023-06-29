const {
    selectAllArticles,
    selectArticleById,
    selectCommentsByArticleId,
    updateArticleById,
    insertCommentByArticleId,
} = require("../models/articles.models")

exports.getAllArticles = (_, res, next) => {
    selectAllArticles()
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const promises = [
        selectCommentsByArticleId(article_id),
        selectArticleById(article_id),
    ]
    Promise.all(promises)
        .then((resolvedPromises) => {
            const comments = resolvedPromises[0]

            res.status(200).send({ comments })
        })
        .catch((err) => {
            next(err)
        })
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    const promises = [
        selectArticleById(article_id),
        updateArticleById(article_id, inc_votes),
    ]
    Promise.all(promises)
        .then((resolvedPromises) => {
            const article = resolvedPromises[1]
            res.status(200).send({ article })
        })
        .catch((err) => {
            next(err)
        })
}

exports.addCommentForAnArticle = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    insertCommentByArticleId(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch((err) => {
            next(err)
        })
}
