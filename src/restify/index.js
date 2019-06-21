const express = require("express");
const { graphql } = require("graphql");
const bodyParser = require("body-parser");

const utils = require("../utils");

const defaultGqlResponseParser = (req, res) => {
  const { gqlRes } = req;
  if (gqlRes.data) {
    // GraphQL responses always have the query/mutation name
    // encapsulating the result. For someone interacting with it
    // through normal REST APIs it might be better to simply return the
    // data in the payload.
    // This line pulls out the first item in the response
    res.status(200).send(gqlRes.data[Object.keys(gqlRes.data)[0]]);
  } else {
    res.status(500).send(gqlRes.error);
  }
};

const restify = (schema, source) => (req, res, next) => {
  graphql({
    schema,
    source,
    variableValues: { ...req.body, ...req.params }
  }).then(gqlRes => {
    req.gqlRes = gqlRes;
    next();
  });
};

const mapEndpointToGql = (router, schema, endpoint) => {
  const definition = utils.gqlDefinition(endpoint.source);
  const method = endpoint.method || utils.methods[definition.operation];
  const middlewares = [
    restify(schema, endpoint.source),
    endpoint.processResponse || defaultGqlResponseParser
  ];

  router[method](endpoint.url, middlewares);
};

module.exports = (schema, endpoints = []) => {
  const router = express.Router();
  router.use(bodyParser.json());
  endpoints.map(endpoint => mapEndpointToGql(router, schema, endpoint));

  return router;
};
