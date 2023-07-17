const db = require("../db/connection")

exports.selectAllArticles = (
    topic,
    sort_by = "created_at",
    order = "DESC",
    limit,
    p
) => {
    let l
    const queryValues = []
    const validSortBy = [
        "article_id",
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
        "article_img_url",
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
    let crossJoin = `CROSS JOIN (
        SELECT COUNT(*) AS total_count 
        FROM articles  `

    let queryStrWhere = ""

    if (topic) {
        queryStrWhere = ` WHERE a.topic = $1 `
        crossJoin += ` WHERE topic = $1 `
        queryValues.push(topic)
    }

    let queryStr = `
        SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes,             a.article_img_url, 
        COUNT(c.comment_id) AS comment_count, total_count
        FROM articles a 
        LEFT JOIN comments c ON c.article_id = a.article_id 
        ${crossJoin} ) AS total_count  ${queryStrWhere}`

    if (sort_by) {
        queryStr += `GROUP BY a.article_id, total_count ORDER BY a.${sort_by} ${order} `
    }

    if (limit) {
        if (!Number(limit)) {
            return Promise.reject({
                status: 400,
                msg: "bad request",
            })
        }
        l = limit > 0 ? limit : 10
        queryStr += `LIMIT ${l} `
    }
    if (p) {
        if (!Number(p)) {
            return Promise.reject({
                status: 400,
                msg: "bad request",
            })
        }
        const page = p > 0 ? p : 1
        queryStr += `OFFSET((${page} - 1) * ${l})`
    }

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    const queryStr = `
        SELECT a.*, 
        COUNT(c.comment_id) AS comment_count 
        FROM articles a
        LEFT JOIN comments c ON c.article_id = a.article_id 
        WHERE a.article_id = $1 
        GROUP BY a.article_id;`

    return db.query(queryStr, [article_id]).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "not found" })
        } else {
            return rows[0]
        }
    })
}

exports.selectCommentsByArticleId = (article_id, limit, p) => {
    let l
    let queryStr = `
        SELECT c.comment_id, c.votes, c.created_at, c.author, c.body, c.article_id
        FROM comments c
        INNER JOIN articles a ON a.article_id = c.article_id
        WHERE c.article_id = $1
        ORDER BY c.created_at DESC `

    if (limit) {
        if (!Number(limit)) {
            return Promise.reject({ status: 400, msg: "bad request" })
        }
        l = limit > 0 ? limit : 10
        queryStr += `LIMIT ${l} `
    }
    if (p) {
        if (!Number(p)) {
            return Promise.reject({ status: 400, msg: "bad request" })
        }
        const page = p > 0 ? p : 1
        queryStr += `OFFSET((${page} - 1) * ${l})`
    }
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

exports.insertNewArticle = (author, title, body, topic, article_img_url) => {
    if (Number(author) || Number(topic)) {
        return Promise.reject({ status: 400, msg: "bad request" })
    }
    const queryStr = `
        INSERT INTO articles
            (title, topic, author, body, article_img_url)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING *;`
    return db
        .query(queryStr, [title, topic, author, body, article_img_url])
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.deleteArticleById = (article_id) => {
    const queryStr = `
        DELETE FROM articles
        WHERE article_id = $1
        RETURNING *;`
    return db.query(queryStr, [article_id]).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "not found" })
        }
        return rows[0]
    })
}
