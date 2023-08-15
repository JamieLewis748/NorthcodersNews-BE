const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndPoints } = require("./controllers/endpoints.controller");
const { getArticleById } = require("./controllers/articles.controller");

const app = express();


app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);
app.get("/api/articles/:article_id", getArticleById);


app.use((req, res) => {
    res.status(404).send({ msg: "Not Found" });
});


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err);
    }
});


app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: error });
});


module.exports = { app };