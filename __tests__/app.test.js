const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const jestSorted = require("jest-sorted");

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
            comment_count: 1,
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
    test("Status: 200, responds with an article object that includes the comment count", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            comment_count: 2,
          });
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
    describe("GET /api/users", () => {
      test("Status: 200, responds with an array of objects, which include the username property", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          });
      });
      test("Status: 200, responds with the length of users array", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
          });
      });
    });
  });
  describe("GET /api/articles", () => { 
    test("Status: 200, responds with an array of article objects incuding the comment count property", () => {
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
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("Status: 200, responds with the length of the returning array", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
        });
    });
    test("Status: 200, the articles are sorted in date by descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("Status 200: responds with an array of comments for the given article id", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              body: "git push origin master",
              votes: 0,
              author: "icellusedkars",
              comment_id: 10,
              created_at: "2020-06-20T07:24:00.000Z",
            },
            {
              body: "Ambidextrous marsupial",
              votes: 0,
              author: "icellusedkars",
              comment_id: 11,
              created_at: "2020-09-19T23:10:00.000Z",
            },
          ]);
        });
    });
    test("Status 200: responds with an array of comments for the given article id", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 16,
              author: "butter_bridge",
              comment_id: 1,
              created_at: "2020-04-06T12:17:00.000Z",
            },
            {
              body: "The owls are not what they seem.",
              votes: 20,
              author: "icellusedkars",
              comment_id: 17,
              created_at: "2020-03-14T17:02:00.000Z",
            },
          ]);
        });
    });
    // test("Status 200: responds with a no comments message for an article that has no comments", () => {
    //   return request(app)
    //     .get("/api/articles/2/comments")
    //     .expect(200)
    //     .then(({ body: { msg } }) => {
    //       expect(msg).toEqual({ msg: "No comments for the article" });
    //     });
    // });
  });
});
