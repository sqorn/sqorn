---
id: setup
title: Setup
sidebar_label: Setup
---

Sqorn requires Node version 8 or above.

Sqorn is a collection of libraries, one for each SQL dialect. Follow the instructions below to install the Sqorn library for your dialect and connect to your database. For additional options, refer to [Configuration](configuration).

## Postgres

Install [Node Postgres](https://www.npmjs.com/package/pg) and [Sqorn Postgres](https://www.npmjs.com/package/@sqorn/pg).

```sh
npm install --save pg @sqorn/pg
```

Create a [Node Postgres connection pool](https://node-postgres.com/features/connecting). Then pass `pg` and `pool` arguments to `sqorn()` to create a query builder `sq`.

```javascript
const pg = require('pg')
const sqorn = require('@sqorn/pg')

const pool = new pg.Pool()
const sq = sqorn({ pg, pool })
```

## MySQL

TODO

## SQLite

TODO