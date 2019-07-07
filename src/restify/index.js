/**
 * Endpoint
 *
 * Defines and endpoint based on a GraphQL query.
 * @typedef {Object} Endpoint
 * @property {string} source - The GraphQL source to execute
 * @property {string} method - The endpoint's HTTP method. Defaults to GET for a query and POST for a mutation.
 * @property {function} responseHandler - Middleware to handle returning the GraphQL response. Defaults to {@link defaultResponseHandler}.
 */

const express = require("express");
const { graphql } = require("graphql");
const bodyParser = require("body-parser");

const utils = require("../utils");

/**
 * Default response handler.
 *
 * Extracts the data field in the GraphQL response, if the
 * data field is not present, return the error with a 500 stauts.
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const defaultResponseHandler = (req, res) => {
  const { gqlRes } = req;
  if (gqlRes.data) {
    // GraphQL responses always have the query/mutation name
    // encapsulating the result. For someone interacting with it
    // through normal REST APIs it might be better to simply return the
    // data in the payload.
    // This line pulls out the first item in the response
    res.status(200).send(gqlRes.data[Object.keys(gqlRes.data)[0]]);
  } else {
    res.status(500).send(gqlRes.errors);
  }
};

const defaultContext = async req => {
  return req;
};

/**
 * Creates a middleware to handle call GraphQL.
 *
 * Creates a middleware based on the GraphQL schema to make
 * the GraphQL query in source every time a request is received
 * in a given endpoint.
 *
 * This middleware does not send the response (`res.send()`), it instead
 * delegates the response sending to another middleware by calling next().
 * @param {Object} schema - GraphQL executable schema
 * @param {String} source - GraphQL source to be executed
 * @return {function} Express middleware callback
 */
const restify = (schema, context, source) => async (req, res, next) => {
  graphql({
    schema,
    source,
    // Interpolates body and url params variables to pass to GraphQL
    variableValues: { ...req.body, ...req.params, ...req.query },
    contextValue: await context(req, res)
  }).then(gqlRes => {
    // Adds the GraphQL response to the request object
    // so that further middlewares can use it.
    req.gqlRes = gqlRes;
    next();
  });
};

/**
 * Maps an endpoint configuration to a configuration in the router
 *
 *
 * @param {Object} router - Express router
 * @param {Object} schema - GraphQL executable schema
 * @param {function} context - Function that generates the context
 * @param {Endpoint} endpoint - Endpoint configuration
 */
const mapEndpointToGql = (router, schema, context, endpoint) => {
  // Get the gql definition from the endpoint's source
  const definition = utils.gqlDefinition(endpoint.source);
  // Use the method required by the endpoint but defaults to the appropriate
  // method (get for queries and post for mutations) if no method is configured.
  const method = endpoint.method || utils.methods[definition.operation];
  // Defines the array of middlewares. The first middleware is always
  // the one created by restify. The second middleware is a function
  // received configured per endpoint, if no function is configured in
  // responseHandler, the default response handler is used.
  const middlewares = [
    restify(schema, context || defaultContext, endpoint.source),
    endpoint.responseHandler || defaultResponseHandler
  ];
  // Finally adds the endpoint + middlewares to the router.
  router[method](endpoint.url, middlewares);
};

module.exports = ({ schema, endpoints = [], context = undefined }) => {
  const router = express.Router();
  router.use(bodyParser.json());
  endpoints.map(endpoint =>
    mapEndpointToGql(router, schema, context, endpoint)
  );

  return router;
};
