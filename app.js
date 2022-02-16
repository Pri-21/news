const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getArticleById } = require("./controllers/articles-controllers");
const { getUsers } = require("./controllers/users-controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
