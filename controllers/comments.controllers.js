const { selectCommentsByArticle, addsNewCommentToArticleId, removeComment, getCommentById } = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.model");

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    const promises = [selectCommentsByArticle(articleId)];

    if (articleId) {
        promises.push(selectArticleById(articleId));
    }

    Promise.all(promises)
        .then((resolvedPromises) => {
            const comments = resolvedPromises[0];
            res.status(200).send({ comments });
        }).catch(next);
};

exports.postNewCommentToArticleId = (req, res, next) => {
    const articleId = req.params.article_id;
    const body = req.body;

    if (!body.author || !body.body) {
        return res.status(400).send({ msg: "Bad request" });
    }

    addsNewCommentToArticleId(articleId, body)
        .then((newComment) => {
            res.status(201).send({ newComment });
        }).catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id;
    console.log("🚀 ~ commentId:", commentId);
    const promises = [removeComment(commentId),];

    if (commentId) {
        promises.push(getCommentById(commentId));
    } else {
        return res.send(400).send({ msg: "bad request" });
    }
    Promise.all(promises)
        .then(() => {
            res.status(204).send();
        }).catch(next);
};