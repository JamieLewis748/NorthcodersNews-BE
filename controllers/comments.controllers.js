const { selectCommentsByArticle } = require("../models/comments.models");
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