const { makeExecutableSchema } = require("graphql-tools");

const testUsers = [{ id: "1", name: "John" }, { id: "2", name: "Mary" }];

module.exports = makeExecutableSchema({
  typeDefs: `
    type User {
      id: ID!
      name: String
    }

    type Query {
      me: User
      users: [User]
      user(id: ID!): User
    }

    type Mutation {
      createUser(name: String!): User
    }
  `,
  resolvers: {
    Query: {
      users: () => testUsers,
      user: (_, { id }) => testUsers.filter(user => user.id === id)[0],
      me: (root, args, ctx, info) => {
        return testUsers.filter(user => user.id === ctx.user)[0];
      }
    },
    Mutation: {
      createUser: (_, { name }) => {
        const newUser = { id: `${testUsers.length + 1}`, name };
        testUsers.push(newUser);
        return newUser;
      }
    }
  }
});
