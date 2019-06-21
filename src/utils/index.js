const gql = require("graphql-tag");

/**
 * Attributes GraphQL operation types to constants
 */
const [QUERY, MUTATION, SUBSCRIPTION, INVALID] = [
  "query",
  "mutation",
  "subscription",
  "invalid"
];

/**
 * Maps GraphQL operaiton constants to HTTP methods
 */
const methods = {
  [QUERY]: "get",
  [MUTATION]: "post",
  [SUBSCRIPTION]: "not_yet_implemented",
  [INVALID]: "invalid"
};

/**
 * Extracts the gql definition of a given source.
 *
 * If the source defines more than one operation, it is
 * deemed invalid.
 * @param {String} source
 */
const gqlDefinition = source => {
  const { definitions } = gql(source);
  if (definitions.length !== 1) return undefined;
  return definitions[0];
};

module.exports = { methods, gqlDefinition };
