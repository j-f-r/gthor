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

const operationMethod = source => {
  const { definitions } = gql(source);
  if (definitions.length !== 1) return INVALID;
  return methods[definitions[0]["operation"]];
};

module.exports = { methods, operationMethod };
