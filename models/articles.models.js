const db = require("../db/connection")
exports.selectArticleById = (article_id) => {
    const queryStr = `
        Select * 
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
