module.exports = [
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
  },
  {
    source:
      "mutation CreateUser($name: String!){ createUser(name: $name) { id name } }",
    url: "/create-user"
  },
  {
    source: "query User($id: ID!){ user(id: $id) { id name } }",
    url: "/custom-users/:id",
    responseHandler: (req, res) =>
      res.status(200).send({ customResponse: req.gqlRes.data })
  },
  {
    source: "{ me { id name } }",
    url: "/me"
  }
];
