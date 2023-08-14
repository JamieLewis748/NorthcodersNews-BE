const express = require("express");
const { getTopics } = require("./controllers/topics.controller");



const app = express();

app.get("/api/topics", getTopics);



app.use((error, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: error });
});


module.exports = { app };