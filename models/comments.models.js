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
};


exports.removeComment = (commentId) => {
    return db
        .query(`DELETE FROM comments
                WHERE comment_id = $1`,
            [commentId]);
};

exports.getCommentById = (commentId) => {
    return db.query(`SELECT * FROM comments 
                    WHERE comment_id = $1`, [commentId])
        .then(({ rows }) => {
            if (rows.length < 1) {
                return Promise.reject({ err: 404, msg: "Not found" });
            }
            return rows;
        });
}

