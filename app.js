const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndPoints } = require("./controllers/endpoints.controller");

const app = express();


app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);

app.use((req, res) => {
    res.status(404).send({ msg: "Not Found" });
});




app.use((error, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: error });
});


module.exports = { app };