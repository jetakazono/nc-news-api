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

exports.updateVoteByCommentId = (comment_id, inc_votes) => {
    const queryStr = `
    UPDATE comments 
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`
    return db.query(queryStr, [inc_votes, comment_id]).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "not found" })
        }
        return rows[0]
    })
}
