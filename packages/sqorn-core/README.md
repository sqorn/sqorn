# Sqorn Core

Sqorn Core is a Javascript library for building query builders.

Query builders built with Sqorn Core are immutable, composable, chainable, fast, and secure.

## Query Builders Built with Sqorn Core

* [**sqorn-pg**](https://github.com/lusakasa/sqorn/tree/master/packages/sqorn-pg) - A Javascript library for building Postgres queries

* [**sqorn-sqlite**](https://github.com/lusakasa/sqorn/tree/master/packages/sqorn-sqlite) - TODO: A Javascript library for building SQLite queries

* [**sqorn-mysql**](https://github.com/lusakasa/sqorn/tree/master/packages/sqorn-mysql) - TODO: A Javascript library for building MySQL queries

## Tutorial

To create your own query builder, you define:

* the available query building methods
* how method calls are compiled to a context object
* the types of queries available and which clauses they comprise
* how to compile each clauses using a context object
* How to connect, disconnect, and issue queries to the database
* How to perform transactions

TODO
