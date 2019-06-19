const express = require("express");

const defaultGraphQLResponseParser = (req, res) => {
  const { graphqlResponse } = req;
  if (graphqlResponse.data) {
    res.status(200).send(graphqlResponse.data);
  } else {
    res.status(500).send(graphqlResponse.error);
  }
};

module.exports = endpoints => {
  const router = express.Router();

  router.get("/", (req, res) => res.send("Hello"));

  return router;
};
