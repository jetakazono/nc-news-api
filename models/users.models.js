const db = require("../db/connection")

exports.selectAllUsers = () => {
    const queryStr = `  
        SELECT *
        FROM users;`
    return db.query(queryStr).then(({ rows }) => {
        return rows
    })
}
