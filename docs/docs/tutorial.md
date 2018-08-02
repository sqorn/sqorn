---
id: tutorial
title: Tutorial
sidebar_label: Tutorial
---

## Setup

### Install

```sh
npm install --save sqorn
npm install --save pg # postgres is the only database currently supported
```


### Initialize

```javascript
const sqorn = require('sqorn')
const sq = sqorn({ client: 'pg', connection: {} })
```

`sqorn` is the function that initializes and returns a query builder with the provided configuration.

`sq` is an object with methods used to build and compile SQL queries.


## Basic Queries

### SQL

```sql
select * from person
```

```javascript
sq.l`select * from person`
```

`sq.l` creates a single complete escaped SQL query.

### Select

### Delete

### Insert

### Update

## Express Syntax

### from - where - returning

### Caveats

## Advanced Queries

### Where Conditions

### Joins

### Upserts

### Having, Group By, Limit, and Offset

### Subqueries and CTEs

## Transactions
