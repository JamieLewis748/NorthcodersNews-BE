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
    const promises = [removeComment(commentId), getCommentById(commentId)];

    Promise.all(promises)
        .then(() => {
            res.status(204).send();
        }).catch(next);
};