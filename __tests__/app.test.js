const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(data));

describe("app", () => {
  describe("GET /api/topics", () => {
    test("Status: 200, responds with an array of topic objects which include the slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test("Status: 404, responds with a not found message when the incorrect path is provided", () => {
      return request(app)
        .get("/api/not-a-route")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    test("status 200:, responds with the length of returning the array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("Status: 200, responds with an article object containing all the required properties", () => {
      return request(app)
        .get("/api/articles/6")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
          });
        });
    });
    test("Status: 404, valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article id does not exist");
        });
    });
    test("Status: 400, invalid id", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("PATCH /api/articles", () => {
    test("Status: 200, responds with the updated article", () => {
      const updatedVotes = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/6")
        .send(updatedVotes)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 2,
          });
        });
    });
    test("Status: 200, responds with the updated article votes when the votes are more than 0", () => {
      const updatedVotes = { inc_votes: 3 };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedVotes)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 103,
          });
        });
    });
    test("Status: 400, responds with missing required fields message", () => {
      const updatedVotes = {};
      return request(app)
        .patch("/api/articles/2")
        .send(updatedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing required field");
        });
    });
    test("Status: 400, responds with incorrect data type message", () => {
      const updatedVotes = { inc_votes: "add" };
      return request(app)
        .patch("/api/articles/3")
        .send(updatedVotes)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect data type");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("Status: 200, responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
  });
});
