const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentByCommentId,
  checkCommentIdExists,
} = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  insertCommentByArticleId(req.body, article_id)
    .then((comments) => {
      res.status(201).send({ comments });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([
    removeCommentByCommentId(comment_id),
    checkCommentIdExists(comment_id),
  ])
    .then(() => {
      res.status(204).send("No content");
    })
    .catch(next);
};
