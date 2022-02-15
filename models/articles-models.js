const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.fetchArticleById = (Id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [Id])
    .then((result) => {
      return result.rows[0];
    });
};

exports.checkArticleExists = (Id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [Id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
        });
      }
    });
};
