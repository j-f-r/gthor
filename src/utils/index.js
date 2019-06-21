const gql = require("graphql-tag");

const [QUERY, MUTATION, SUBSCRIPTION, INVALID] = [
  "query",
  "mutation",
  "subscription",
  "invalid"
];
const methods = {
  [QUERY]: "get",
  [MUTATION]: "post",
  [SUBSCRIPTION]: "not_yet_implemented",
  [INVALID]: "invalid"
};

const gqlDefinition = source => {
  const { definitions } = gql(source);
  if (definitions.length !== 1) return undefined;
  return definitions[0];
};

module.exports = { methods, gqlDefinition };
