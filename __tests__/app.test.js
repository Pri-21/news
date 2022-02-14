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
    test("status 200:, responds with the length of the array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
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
  });
  //   describe("GET /api/articles", () => {
  //     test("Status: 200, repsonds with an article object containing all the required properties", () => {
  //       return request(app)
  //         .get("/api/articles/:article:id")
  //         .expect(200)
  //         .then(({ body: { articles } }) => {
  //           articles.forEach((article) => {
  //             expect(article).toEqual(
  //               expect.objectContaining({
  //                 author: expect.any(String),
  //                 title: expect.any(String),
  //                 article_id: expect.any(Number),
  //                 body: expect.any(String),
  //                 topic: expect.any(String),
  //                 created_at: expect.any(String),
  //                 votes: expect.any(Number),
  //               })
  //             );
  //           });
  //         });
  //     });
  //   });
});
