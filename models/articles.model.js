const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then(({ rows }) => {
        if (rows.length < 1) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
        return rows[0];
    });
};

exports.selectAllArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    const acceptedSortQueries = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url"];
    const acceptedOrders = ["asc", "desc"];

    if (!acceptedSortQueries.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Bad request, invalid sort query" });
    }
    if (!acceptedOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad request, invalid order query" });
    }

    let queryString = `SELECT 
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

    if (topic) {
        queryString += ` WHERE articles.topic = '${topic}'`;
    }

    queryString += ` GROUP BY
        articles.article_id
    ORDER BY ${sort_by} ${order}`;

    return db
        .query(queryString)
        .then(({ rows }) => {
            if (rows.length < 1) {
                return [];
            }
            return rows;
        });
};



exports.updateArticle = (articleId, inc_votes) => {
    return db
        .query(
            `UPDATE articles 
            SET votes = votes + $2
            WHERE article_id = $1
            RETURNING *`,
            [articleId, inc_votes]
        )
        .then(({ rows }) => {
            if (rows.length < 1) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }
            return rows[0];
        });
};


