const {
  fetchArticleById,
  checkArticleExists,
} = require("../models/articles-models");
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchArticleById(article_id), checkArticleExists(article_id)])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
