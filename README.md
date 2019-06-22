# GThor

[![npm version](https://img.shields.io/npm/v/gthor.svg)](https://npmjs.com/package/gthor)
[![npm bundle size](https://img.shields.io/bundlephobia/min/gthor.svg)](https://npmjs.com/package/gthor)

[![documentation](https://readthedocs.org/projects/pip/badge/)](/docs/DOCS.md)
![test coverage](/badges/badge-lines.svg)

Exposes GraphQL queries and mutations as configurable RESTful endpoints.

## Installation

```
npm i gthor
```

## About

This package is used to expose GraphQL queries/mutations as REST endpoints. The benefits of using GraphQL are widely known, however, when working on projects in which your team is not responsible for the client side architecture, it might be necessary to provide run of the mill endpoints.

There are other packages such as [sofa-api](https://github.com/Urigo/SOFA) that automates exposing all available queries and mutations as REST endpoints. However due to being automation-centric, these packages to not allow for in-depth configuration of how each endpoint works.

## Getting started

Given a GraphQL schema such as:

```
type User {
    id: ID!
    name: String
}

type Query {
    users: [User]
    user(id: ID!): User
}
```

You can configure REST points using `gthor` as easy as:

```
const express = require('express');
const gthor = require('gthor');
const schema = require('./schema');

app.use(
    '/rest',
    gthor(
        schema,
        [{
            url: '/users',
            source: '{ users { name } }'
        }]
    )
);
```

which will execute the GraphQL query `{ users { name } }` every time a request to `/rest/users` is made. It's worth it to point out that this request will only return user names, which wouldn't be possible in an automatic-centric package.

### Context

An `async` context generator function can be provided via:

```
gthor(
    schema,
    [{
        url: '/users',
        source: '{ users { name } }'
    }],
    async (req) => {
        user: req.headers.user, // This would come from a token
        db: new MongoClient(url) // Example of a shared database connection
    }
)
```

## TODO

- [ ] Automatic OpenAPI documentation
- [ ] Subscriptions
- [ ] Automatic endpoints generation

## License

[MIT](/LICENSE.md) © João Furtado
