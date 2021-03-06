const express = require("express");
const request = require("supertest");

const gthor = require("..");

const schema = require("./schema");
const endpoints = require("./endpoints");

const app = express();
const gthorRouter = gthor({
  schema,
  endpoints,
  async context(req) {
    return {
      // In a production environment, this would be encrypted
      // with something like JWT
      user: req.headers.user
    };
  }
});

app.use("/api", gthorRouter);

let server, agent;

beforeEach(done => {
  server = app.listen(4000, err => {
    if (err) return done(err);
    agent = request.agent(server);
    done();
  });
});

afterEach(done => {
  return server && server.close(done);
});

describe("Test restify responds to", () => {
  test("Queries without parameters", async () => {
    const response = await agent.get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([
      { id: "1", name: "John" },
      { id: "2", name: "Mary" }
    ]);
  });

  test("Queries with url parameters", async () => {
    let response = await agent.get("/api/users/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ id: "1", name: "John" });

    response = await agent.get("/api/users/2");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ id: "2", name: "Mary" });
  });

  test("Queries with body parameters", async () => {
    let response = await agent.post("/api/users").send({ id: "1" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ id: "1", name: "John" });

    response = await agent.post("/api/users").send({ id: "2" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ id: "2", name: "Mary" });
  });

  test("Mutations with body parameters", async () => {
    let response = await agent
      .post("/api/create-user")
      .send({ name: "Joseph" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ id: "3", name: "Joseph" });
  });
});

describe("Test restify uses custom response parsing functions", () => {
  test("Custom response function", async () => {
    let response = await agent.get("/api/custom-users/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      customResponse: { user: { id: "1", name: "John" } }
    });
  });
});

describe("Test context passing", () => {
  test("Should parse id from context", async () => {
    let response = await agent.get("/api/me").set("User", "1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ id: "1", name: "John" });

    response = await agent.get("/api/me").set("User", "2");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ id: "2", name: "Mary" });
  });
});
