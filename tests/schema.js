const { makeExecutableSchema } = require("graphql-tools");

const testUsers = [{ id: "1", name: "John" }, { id: "2", name: "Mary" }];

module.exports = makeExecutableSchema({
  typeDefs: `
    type User {
      id: ID!
      name: String
    }

    type Query {
      users: [User]
      user(id: ID!): User
    }
  `,
  resolvers: {
    Query: {
      users: () => testUsers
    }
  }
});
