const db = require("../db/connection.js");

exports.selectAllArticles = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows }) => {
        return rows;
    });
};