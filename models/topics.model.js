const db = require("../db/connection");

exports.selectAllTopics = () => {
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `404: No data`
            });
        }
        return rows;
    });
};