const {
    selectAllArticles,
    selectArticleById,
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
