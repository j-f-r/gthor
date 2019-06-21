const utils = require("../src/utils");

const queries = [
  `
{ 
    queryName { 
        field1 
        field2 
    } 
}`,
  `
{ 
    queryName(p1: 100 ) { 
      fields 
  } 
}`,
  `
query QueryWithVariable($p1: String) { 
    queryName(p1: $p1 ) { 
      fields 
  } 
}`
];

const mutations = [
  `
mutation MutationName($p1: String!) {
    mutationName(parameter1: $p1) {
        field1
        field2
    }
}`
];

const invalidSources = [
  `
  query QueryWithVariable($p1: String) { 
    queryName(p1: $p1 ) { 
      fields 
  } 
}

  mutation MutationName($p1: String!) {
      mutationName(parameter1: $p1) {
          field1
          field2
      }
  }`
];

describe("Test gqlDefinition", () => {
  test("Queries", () => {
    queries.map(query => {
      const definition = utils.gqlDefinition(query);
      expect(utils.methods[definition.operation]).toBe(utils.methods["query"]);
    });
  });

  test("Mutations", () => {
    mutations.map(mutation => {
      const definition = utils.gqlDefinition(mutation);
      expect(utils.methods[definition.operation]).toBe(
        utils.methods["mutation"]
      );
    });
  });

  test("Invald sources", () => {
    invalidSources.map(invalidSource =>
      expect(utils.gqlDefinition(invalidSource)).toBe(undefined)
    );
  });
});
