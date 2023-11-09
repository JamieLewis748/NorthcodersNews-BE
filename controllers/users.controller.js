const { selectAllUsers, selectUserByEmail, createUserByEmail } = require("../models/users.model.js");


exports.getAllUsers = (req, res, next) => {
    selectAllUsers().then((users) => {
        res.status(200).send({ users });
        ;
    }).catch(next);
};


exports.getUserByEmail = (req, res, next) => {
    const { email } = req.params;
    selectUserByEmail(email).then((user) => {
        res.status(200).send({ user });
    }).catch(next);
};

exports.postNewUser = (req, res, next) => {
    const {body} = req.body;
const {username, name, email, avatar_url} = body

createUserByEmail(username, name, email, avatar_url)
    .then((newUser) => {
        res.status(201).send({ newUser });
    }).catch(next);
}