const db = require("../db/connection");


exports.selectCommentsByArticle = (articleId) => {

    return db.query(`SELECT * FROM comments 
                    WHERE comments.article_id = $1
                    ORDER BY created_at DESC`, [articleId]).then(({ rows }) => {
        return rows;
    });
};



