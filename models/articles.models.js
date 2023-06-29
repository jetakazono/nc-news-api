const db = require("../db/connection")

exports.selectAllArticles = (topic, sort_by = "created_at", order = "DESC") => {
    const queryValues = []
    const validSortBy = [
        "created_at",
        "author",
        "title",
        "topic",
        "votes",
        "comment_count",
    ]
    const validOrderBy = ["DESC", "ASC"]

    if (
        !validOrderBy.includes(order.toUpperCase()) ||
        !validSortBy.includes(sort_by)
    ) {
        return Promise.reject({
            status: 400,
            msg: "bad request",
        })
    }

    let queryStr = `
    SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url, 
    COUNT(c.comment_id) AS comment_count
    FROM articles a 
    LEFT JOIN comments c ON c.article_id = a.article_id `

    if (topic) {
        queryStr += `WHERE a.topic = $1 `
        queryValues.push(topic)
    }
    if (sort_by) {
        queryStr += `GROUP BY a.article_id ORDER BY a.${sort_by} ${order}`
    }
    return db.query(queryStr, queryValues).then(({ rows }) => {
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
            return Promise.reject({ status: 404, msg: "not found" })
        } else {
            return rows[0]
        }
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `
        SELECT c.comment_id, c.votes, c.created_at, c.author, c.body, c.article_id
        FROM comments c
        INNER JOIN articles a ON a.article_id = c.article_id
        WHERE c.article_id = $1
        ORDER BY c.created_at DESC;`
    return db.query(queryStr, [article_id]).then(({ rows }) => {
        return rows
    })
}

exports.updateArticleById = (article_id, newVotes) => {
    const queryStr = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`
    return db.query(queryStr, [newVotes, article_id]).then(({ rows }) => {
        return rows[0]
    })
}

exports.insertCommentByArticleId = (article_id, username, body) => {
    const queryStr = `
        INSERT INTO comments
            (body, author, article_id)
        VALUES ($1, $2, $3)
        RETURNING *;`

    return db.query(queryStr, [body, username, article_id]).then(({ rows }) => {
        return rows[0]
    })
}

exports.checkTopicExists = (topic) => {
    if (Number(topic)) {
        return Promise.reject({ status: 400, msg: "bad request" })
    }
    const queryStr = `
        SELECT *
        FROM topics
        WHERE slug = $1;`
    return db.query(queryStr, [topic]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "not found" })
        }

        return rows
    })
}
