---
id: api
title: API
sidebar_label: API
---

## INTRODUCTION

Typings

### sqorn

```typescript
sqorn: Configuration => sq
```

### sq

## QUERY

### l

### raw

## COMMON

### frm

### whr

### ret

### wth

### jon


## SELECT 

### grp

### hav

### ord

### lim

### off


## DELETE

### del


## INSERT

### ins

### val


## UPDATE

### upd



## EXECUTE

### all

: async (trx?: Transaction) => any[]

__Description:__

  Executes the query

__Returns:__

  a promise for an array of results (which may have length 0)

### one

: async (trx?: Transaction) => any

__Description:__

  executes the query

__Returns:__

  a promise for the first row returned by the query or `undefined` if no rows were returned

### run

: async (trx?: Transaction) => void

__Description:__

  executes the query

__Returns:__

  a promise that resolves when the query is done


### exs

: async (trx?: Transaction) => boolean

__Description:__

  executes the query

__Returns:__

  a promise that resolves to true if at least one row was returned by the query, false otherwise

### qry

__Description:__

  Runs the asynchronous callback function in the context of a transaction. A `Transaction` object `trx` is made available to the callback and should be passed to all queries that are part of the transaction.

__Returns:__

  the value return by the callback


### str

: () => string

__Description:__

  builds a SQL query string representing the current context

__Returns:__

  a SQL query string representation of the current context

## OPERATORS

### and

### or

### not

### op

## MISCELLANEOUS

### opt

### trx

### end
