const db = require("../db/connection")

exports.deleteCommentById = (comment_id) => {
    const queryStr = `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`
    return db.query(queryStr, [comment_id]).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "not found" })
        }
    })
}
