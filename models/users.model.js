const db = require("../db/connection.js");

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows }) => {
        return rows;
    });
};


exports.selectUserByEmail = (email) => {
    return db.query(`SELECT * FROM users
    WHERE email = $1` , [email]).then(({ rows }) => {
        if (rows.length < 1) {
            return Promise.reject({ err: 404, msg: "Not found" });
        }
        return rows[0];
    });
};

exports.createUserByEmail = (username, name, email, avatar_url) => {
    return db.query(`INSERT INTO users (username, name, email, avatar_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *`, [username, name, email, avatar_url]).then(({ rows }) => {
        return rows[0];
    });

}