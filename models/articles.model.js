const db = require("../db/connection");


exports.selectArticleById = (articleId) => {

    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then(({ rows }) => {

        if (rows.length < 1) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
        return rows[0];
    });
};
