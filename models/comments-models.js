const db = require("../db/connection");

exports.fetchCommentsByArticleId = (Id) => {
  return db
    .query(
      "SELECT author, body, comment_id, created_at, votes FROM comments WHERE comments.article_id = $1",
      [Id]
    )
    .then((result) => {
      // if (result.rows.length === 0) {
      //   return Promise.reject({ msg: "No comments for the article" });
      // } else
      return result.rows;
    });
};
