# Experiments

## Model Query builder with Set Types

Just design experiments, mostly related to modeling SQL building through Type sets.

Queries may be of the following types:

* S: Select
* U: Update
* D: Delete
* I: Insert
* V: Values
* M: Manual

Each Query Type has some subset of the available builder methods:

* from()
* where()
* return()
* order()
* limit()
* offset()
* group()
* having()
* insert()
* update()
* delete()
* values()
* l()
* raw()

For example, Insert has the methods:

* from()
* return()
* insert()

And Delete has the methods:

* from()
* return()
* where()
* delete()

When you start, there are no constraints on the type of query, so its type is the union of all possible query types:

* StartQuery = S | U | D | I | V | M

Given a query type, what methods should its builder expose?

All methods for all possible query types:

* Builder(Query) = Intersection of Methods of all union members

For the start builder, this is:

* StartBuilder
* = Builder(StartQuery)
* = Builder(S | U | D | I | V | M)
* = Methods(S) & Methods(U) & Methods(D) & Methods(I) & Methods(V) & Methods(M)

A builder's query is obtained with the inverse operation.

* Query(StartBuilder)
* = Query(Methods(S) & Methods(U) & Methods(D) & Methods(I) & Methods(V) & Methods(M))
* = S | U | D | I | V | M

Calling a method constrains the possible query types because methods can only be called on certain types of queries.

For example, where() can only be called on Select, Update, and Delete queries.

* Domain(where) = S | U | D

When a method is called, the constraints imposed on the query type is the intersection of the current query type and the domain of the called method.

* Next(B, method) = Builder(Query(B) & Domain(method))

For example, calling where() on the StartBuilder tells you the next query must be of the following type:

* Next(StartBuilder, where)
* = Builder(Query(StartBuilder) & Domain(where))
* = Builder(Query(Methods(S) & Methods(U) & Methods(D) & Methods(I) & Methods(V) & Methods(M)) & Domain(S | U | D))
* = Builder((S | U | D | I | V | M) & (S | U | D))
* = Builder(S | U | D)
* = Methods(S) & Methods(U) & Methods(D)

Sqorn lets you you extend one builder with another. The resulting builder's query type is the intersection of the original builder's query types.

* Extend(a, b) = Builder(Query(a) & Query(b))

For example, say we have a builder with query type (S | U | D) and another with query type (S | V), we know the resulting query type is S:

* Extend(Builder(S | U | D), Builder(S | V))
* = Builder(Query(Builder(S | U | D)) & Query(Builder(S | V)))
* = Builder ((S | U | D) & (S | V))
* = Builder(S)
* = Methods(S)

## Pros/Cons

