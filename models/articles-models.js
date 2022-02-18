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

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  topic = false
) => {
  if (!["created_at", "votes", "author", "title", "topic"].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr1 = "";
  if (topic !== false) {
    queryStr1 = `WHERE articles.topic = '${topic}' `;
  }
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ${queryStr1} `;

  if (sort_by) {
    queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} `;
  }

  if (order) {
    queryStr += `${order};`;
  }

  if (!topic) {
    return db.query(queryStr).then((result) => {
      return result.rows;
    });
  }

  const query1 = db.query(
    `SELECT topics.slug FROM topics WHERE topics.slug = '${topic}';`
  );

  const query2 = db.query(queryStr);
  return Promise.all([query1, query2]).then(([topicResult, articleResult]) => {
    if (topicResult.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Topic does not exist" });
    } else {
      if (articleResult.rows.length === 0) {
        return Promise.reject({
          ststus: 200,
          msg: "No articles for this topic",
        });
      }
      return articleResult.rows;
    }
  });
};
