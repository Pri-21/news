const cors = require("cors");

const express = require("express");
const app = express();
app.use(cors());
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  patchArticleVotes,
  getArticles,
} = require("./controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/comments-controllers");
const { getUsers } = require("./controllers/users-controllers");
const { getEndpoints } = require("./controllers/endpoints-controllers");

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required field" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
