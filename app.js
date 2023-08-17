const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndPoints } = require("./controllers/endpoints.controller");
const { getArticleById, getAllArticles, patchArticle } = require("./controllers/articles.controller");
const { getCommentsByArticle, postNewCommentToArticleId, deleteCommentById } = require("./controllers/comments.controllers");

const app = express();
app.use(express.json());



app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.post("/api/articles/:article_id/comments", postNewCommentToArticleId);


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

app.use((err, req, res, next) => {
    if (err.code = '23503') {
        res.status(404).send({ msg: "Not found" });
    } else {
        next(err);
    }
}
);

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: error });
});


module.exports = { app };