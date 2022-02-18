const db = require("../db/connection");

exports.fetchCommentsByArticleId = (Id) => {
  const query1 = db.query(
    "SELECT author, body, comment_id, created_at, votes FROM comments WHERE comments.article_id = $1",
    [Id]
  );

  const query2 = db.query("SELECT * FROM articles WHERE article_id = $1", [Id]);

  return Promise.all([query1, query2]).then(([comments, articles]) => {
    if (articles.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article does not exist" });
    } else {
      if (comments.rows.length === 0) {
        return Promise.reject({
          status: 200,
          msg: "No comments for the article",
        });
      }
      return comments.rows;
    }
  });
};

exports.insertCommentByArticleId = (postedComment, Id) => {
  const { username, body } = postedComment;
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
      [Id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};
