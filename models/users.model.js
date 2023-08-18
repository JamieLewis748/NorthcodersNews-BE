const db = require("../db/connection.js");

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows }) => {
        return rows;
    });
};


exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users
    WHERE username = $1` , [username]).then(({ rows }) => {
        if (rows.length < 1) {
            return Promise.reject({ err: 404, msg: "Not found" });
        }
        return rows[0];
    });
};