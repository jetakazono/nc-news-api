const db = require("../db/connection")

exports.selectAllUsers = () => {
    const queryStr = `  
        SELECT *
        FROM users;`
    return db.query(queryStr).then(({ rows }) => {
        return rows
    })
}

exports.selectUserByUsername = (username) => {
    const queryStr = `
        SELECT * 
        FROM users
        WHERE username = $1;`

    return db.query(queryStr, [username]).then(({ rows }) => {
        if (!isNaN(username)) {
            return Promise.reject({ status: 400, msg: "bad request" })
        }
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "not found" })
        }
        return rows[0]
    })
}
