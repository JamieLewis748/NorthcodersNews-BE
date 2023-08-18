const { selectArticleById, selectAllArticles, updateArticle } = require("../models/articles.model");
const { checkTopicExists } = require("../models/topics.model");

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    selectArticleById(articleId).then((article) => {
        res.status(200).send({ article });
    }).catch(next);
};

exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query;
    const promises = [selectAllArticles(topic, sort_by, order)];

    if (topic) {
        promises.push(checkTopicExists(topic));
    }

    Promise.all(promises).then((resolvedPromises) => {
        const articles = resolvedPromises[0];
        res.status(200).send({ articles });
    }).catch(next);
};

exports.patchArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    const { inc_votes } = req.body;

    const promises = [updateArticle(articleId, inc_votes), selectArticleById(articleId)];

    Promise.all(promises).then((resolvedPromises) => {
        const newArticle = resolvedPromises[0];
        res.status(200).send(newArticle);
    }).catch(next);
};