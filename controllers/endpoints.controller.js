const endpoints = require("../endpoints.json");

exports.getEndPoints = (req, res) => {
    res.status(200).json(endpoints);
};
