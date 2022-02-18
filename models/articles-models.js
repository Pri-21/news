const db = require("../db/connection");

exports.fetchArticleById = (Id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [Id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.checkArticleExists = (Id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [Id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
        });
      }
    });
};

exports.updateArticleVotes = (Id, updatedVotes) => {
  const { inc_votes: newVote } = updatedVotes;
  if (typeof newVote === "string") {
    return Promise.reject({
      status: 400,
      msg: "Incorrect data type",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVote, Id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT author, title, article_id, topic, created_at, votes FROM articles ORDER BY created_at DESC;"
    )
    .then((result) => {
      return result.rows;
    });
};
