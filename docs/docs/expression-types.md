---
id: expression-types
title: Expression Types
sidebar_label: Expression Types
---

To interpret these type signatures, read [Understanding Expression Types](#understanding-expression-types).

## Value

* `e: T => T`
* `e: T1 => T2 => ... Tn => ROW (T1, T2, ...Tn)`
* `unknown: any => unknown`
* `boolean: boolean => boolean`
* `number: number => number`
* `string: string => string`
* `array: array => array`
* `subquery: subquery => subquery`
* `row: row => row`
* `json: json => json`

## Logical

* `and: boolean => ...boolean => boolean`
* `or: boolean => ...boolean => boolean`
* `not: boolean => boolean`

## Comparison

* `eq: T => T => boolean`
* `neq: T => T => boolean`
* `lt: T => T => boolean`
* `gt: T => T => boolean`
* `lte: T => T => boolean`
* `gte: T => T => boolean`
* `between: T => T => T => boolean`
* `notBetween: T => T => T => boolean`
* `isDistinctFrom: T => T => boolean`
* `isNotDistinctFrom: T => T => boolean`
* `isNull: T => boolean`
* `isNotNull: T => boolean`
* `isTrue: T => boolean`
* `isNotTrue: T => boolean`
* `isFalse: T => boolean`
* `isNotFalse: T => boolean`
* `isUnknown: T => boolean`
* `isNotUnknown: T => boolean`

## Subquery, Values List, Array

* `in: T => subquery => boolean`
* `in: T => T[] => boolean`
* `not: => T => subquery => boolean`
* `not: => T => T[] => boolean`
* `any: T => subquery => boolean`
* `any: T => array => boolean`
* `some: T => subquery => boolean`
* `some: T => array => boolean`
* `all: T => subquery => boolean`
* `all: T => array => boolean`

## Math

* `add: number => number => number`
* `subtract: number => number => number`
* `multiply: number => number => number`
* `divide: number => number => number`

## String

* `concat: string => ...string => string`
* `like: string => string => boolean`
* `notLike: string => string => boolean`
* `similarTo: string => string => boolean`
* `notSimilarTo: string => string => boolean`
* `lower: string => string`
* `upper: string => string`

## Conditional


## Understanding Expression Types

Each expression type is listed with its compatible types:

* **boolean** - `true`, `false`, boolean expression, `null`, unknown expression, query
* **number** - number literal, number expression, `null`, unknown expression, query
* **string** - string literal, string expression, `null`, unknown expression, query
* **array** - Javascript Array, array expression, `null`, unknown expression, query
* **json** - Javascript Object, json expression, `null`, unknown expression, query
* **row** - row expression, `null`, unknown, expression, query
* **subquery** - `null`, unknown, expression, query
* **unknown** - any

### Signatures

The type signatures listed below should be interpreted as follows:

`method_name: arg1_type => arg2_type => return_type`

`T` indicates a generic type.

For example, interpret `eq => T => T => boolean` as method `eq` takes two arguments of the same type and returns a boolean expression.

### Type Safety

Sqorn Expressions offer limited compile time (but not run time) type safety.

Expressions on scalar types like booleans, numbers, and strings are type safe.

Expressions on non-scalar types like arrays, json, rows, and subqueries are not type safe.
