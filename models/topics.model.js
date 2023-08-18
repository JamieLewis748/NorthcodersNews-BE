const db = require("../db/connection");

exports.selectAllTopics = () => {
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        return rows;
    });
};

exports.checkTopicExists = (topic) => {
    return db.query("SELECT * FROM topics WHERE topics.slug = $1", [topic])
        .then(({ rows }) => {
            if (rows.length < 1) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }

            return rows;
        });
};