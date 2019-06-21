const express = require("express");
const request = require("supertest");

const schema = require("./schema");
const gthor = require("..");

const endpoints = [
  {
    source: "{ users { id name } }",
    url: "/users"
  },
  {
    source: "query User($id: ID!){ user(id: $id) { id name } }",
    url: "/users/:id"
  },
  {
    source: "query User($id: ID!){ user(id: $id) { id name } }",
    url: "/users",
    method: "post"
  }
];

const app = express();
const gthorRouter = gthor(schema, endpoints);

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
    expect(response.body).toStrictEqual({
      users: [{ id: "1", name: "John" }, { id: "2", name: "Mary" }]
    });
  });

  test("Queries with url parameters", async () => {
    let response = await agent.get("/api/users/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      user: { id: "1", name: "John" }
    });

    response = await agent.get("/api/users/2");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      user: { id: "2", name: "Mary" }
    });
  });

  test("Queries with body parameters", async () => {
    let response = await agent.post("/api/users").send({ id: "1" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      user: { id: "1", name: "John" }
    });

    response = await agent.post("/api/users").send({ id: "2" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      user: { id: "2", name: "Mary" }
    });
  });
});
