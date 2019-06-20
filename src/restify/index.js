const express = require("express");
const { graphql } = require("graphql");

const utils = require("../utils");

const defaultGqlResponseParser = (req, res) => {
  const { gqlRes } = req;
  if (gqlRes.data) {
    res.status(200).send(gqlRes.data);
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
  const method = endpoint.method || utils.operationMethod(endpoint.source);
  const middlewares = [
    restify(schema, endpoint.source),
    endpoint.postProcess || defaultGqlResponseParser
  ];
  router[method](endpoint.url, middlewares);
};

module.exports = (schema, endpoints = []) => {
  const router = express.Router();

  endpoints.map(endpoint => mapEndpointToGql(router, schema, endpoint));

  return router;
};
