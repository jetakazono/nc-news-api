const db = require("../db/connection")

exports.selectAllTopics = () => {
    const queryStr = `SELECT * FROM topics`
    return db.query(queryStr).then(({ rows }) => {
        return rows
    })
}
