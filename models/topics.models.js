const db = require("../db/connection")

exports.selectAllTopics = () => {
    const queryStr = `SELECT * FROM topics`

    return db.query(queryStr).then(({ rows }) => {
        return rows
    })
}

exports.insertTopic = (slug, description) => {
    const queryStr = `
        INSERT INTO topics
            (slug, description)
        VALUES 
            ($1, $2)
        RETURNING *;`

    return db.query(queryStr, [slug, description]).then(({ rows }) => {
        return rows[0]
    })
}
