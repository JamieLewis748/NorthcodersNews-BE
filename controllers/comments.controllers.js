const { selectCommentsByArticle, addsNewCommentToArticleId } = require("../models/comments.models");
const { doesArticleExist } = require("../models/articles.model");

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    const promises = [selectCommentsByArticle(articleId)];

    if (articleId) {
        promises.push(doesArticleExist(articleId));
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