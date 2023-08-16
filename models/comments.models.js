const db = require("../db/connection");


exports.selectCommentsByArticle = (articleId) => {

    return db.query(`SELECT * FROM comments 
                    WHERE comments.article_id = $1
                    ORDER BY created_at`, [articleId]).then(({ rows }) => {
        return rows;
    });
};



