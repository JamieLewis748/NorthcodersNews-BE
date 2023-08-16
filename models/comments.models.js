const db = require("../db/connection");


exports.selectCommentsByArticle = (articleId) => {

    return db.query(`SELECT * FROM comments 
                    WHERE comments.article_id = $1
                    ORDER BY created_at DESC`, [articleId]).then(({ rows }) => {
        return rows;
    });
};

exports.addsNewCommentToArticleId = (articleId, body) => {
    return db
        .query(`INSERT INTO comments 
        (body, article_id, author, votes, created_at) 
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
        RETURNING *`,
            [body.body, articleId, body.author, 0])
        .then(({ rows }) => {
            return rows[0];
        });

}



