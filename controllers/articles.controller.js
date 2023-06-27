const {
    selectAllArticles,
    selectArticleById,
    selectCommentsByArticleId,
    insertCommentByArticleId,
    selectUserByUsername,
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

exports.addCommentForAnArticle = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body

    const promises = [
        selectUserByUsername(username),
        selectArticleById(article_id),
        insertCommentByArticleId(article_id, username, body),
    ]
    Promise.all(promises)
        .then((resolvedPromises) => {
            const comment = resolvedPromises[2]

            res.status(201).send({ comment })
        })
        .catch((err) => {
            next(err)
        })
}
