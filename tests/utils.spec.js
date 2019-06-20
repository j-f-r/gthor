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

describe("Test operationMethod", () => {
  test("Queries", () => {
    queries.map(query =>
      expect(utils.operationMethod(query)).toBe(utils.methods["query"])
    );
  });

  test("Mutations", () => {
    mutations.map(mutation =>
      expect(utils.operationMethod(mutation)).toBe(utils.methods["mutation"])
    );
  });

  test("Invald sources", () => {
    invalidSources.map(invalidSource =>
      expect(utils.operationMethod(invalidSource)).toBe(
        utils.methods["invalid"]
      )
    );
  });
});
