const db = require("../db/connection")

exports.selectAllArticles = () => {
    const queryStr = `
    SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url, 
    COUNT(a.article_id) AS comment_count
    FROM articles a 
    LEFT JOIN comments c ON c.article_id = a.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;`

    return db.query(queryStr).then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    const queryStr = `
        SELECT * 
        FROM articles 
        WHERE article_id = $1;`

    return db.query(queryStr, [article_id]).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "article not found" })
        } else {
            return rows[0]
        }
    })
}
