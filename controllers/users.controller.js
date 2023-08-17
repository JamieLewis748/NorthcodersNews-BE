const { selectAllArticles } = require("../models/users.model.js");


exports.getAllUsers = (req, res, next) => {
    selectAllArticles().then((users) => {
        res.status(200).send(users);
        ;
    }).catch(next);
};