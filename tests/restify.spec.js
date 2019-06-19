const express = require("express");
const request = require("supertest");

const gthor = require("..");

const app = express();
const gthorRouter = gthor();

app.use("/api", gthorRouter);

let server, agent;

beforeEach(done => {
  server = app.listen(4000, err => {
    if (err) return done(err);

    agent = request.agent(server); // since the application is already listening, it should use the allocated port
    done();
  });
});

afterEach(done => {
  return server && server.close(done);
});

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await agent.get("/api");
    expect(response.statusCode).toBe(200);
  });
});
