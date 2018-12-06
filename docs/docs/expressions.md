---
id: expressions
title: Expressions
sidebar_label: Expressions
---

* **Values** [`e`](#values), [`e.raw`](#values), [`e.row`](#values), [`e.array`](#values)
* **Logical** [`e.and`](#and), [`e.or`](#or), [`e.not`](#not)
* **Comparison**
  * **Operators** [`e.eq`](#comparison-operators), [`e.neq`](#comparison-operators), [`e.lt`](#comparison-operators), [`e.gt`](#comparison-operators), [`e.lte`](#comparison-operators), [`e.gte`](#comparison-operators)
  * **Between** [`e.between`](#between-not-between), [`e.notBetween`](#not-between)
  * **Distinct** [`e.isDistinct`](#is-distinct-is-not-distinct), [`e.isNotDistinct`](#is-distinct-is-not-distinct)
  * **Null** [`e.isNull`](#is-null-is-not-null), [`e.isNotNull`](#is-null-is-not-null)
  * **Boolean** [`e.true`](#true-not-true-false-not-false-unknown-not-unknown), [`e.notTrue`](#true-not-true-false-not-false-unknown-not-unknown), [`e.false`](#true-not-true-false-not-false-unknown-not-unknown), [`e.notFalse`](#true-not-true-false-not-false-unknown-not-unknown), [`e.unknown`](#true-not-true-false-not-false-unknown-not-unknown), [`e.notUnknown`](#true-not-true-false-not-false-unknown-not-unknown)
* **Subquery** [`e.exists`](#exists), [`e.notExists`](#not-exists), [`e.in`](#in), [`e.notIn`](#not-in), [`e.any`](#any), [`e.some`](#some), [`e.all`](#all)
* **Row and Array** [`e.in`](#in), [`e.notIn`](#not-in`), [`e.any`](#any), [`e.some`](#some), [`e.all`](#all), [`e.row`](#row), [`e.array`](#array)
* **Math**
  * **Operators** [`e.add`](#add), [`e.subtract`](#subtract), [`e.multiply`](#multiply), [`e.divide`](#divide), [`e.mod`](#modulo), [`e.exp`](#exponentiation), [`e.sqrt`](#square-root), [`e.cbrt`](#cube-root), [`e.factorial`](#factorial), [`e.abs`](#absolute-value)
  * **Binary** [`e.binary`](#binary), [`e.andb`](#binary-and), [`e.orb`](#binary-or), [`e.xorb`](#binary-xor), [`e.notb`](#binary-not), [`e.shiftLeft`](#shift-left), [`e.shiftRight`](#shift-right)
* **Aggregate** [`e.count`](#count), [`e.sum`](#sum), [`e.avg`](#average), [`e.min`](#min), [`e.max`](#max), [`e.stddev`](#standard-deviation), [`e.variance`](#variance)
* **Conditional** [`.case`](#case), [`e.coallesce`](#coallesce), [`e.nullif`](#nullif), [`e.greatest`](#greatest), [`e.least`](#least)
* **String** [`e.concat`](#string-concatenation), [`e.substring`](#substring), [`e.length`](#length), [`e.bitLength`](#bit-length), [`e.charLength`](#charLength), [`e.lower`](#lower), [`e.upper`](#upper), [`e.like`](#like), [`e.notLike`](#not-like), [`e.iLike`](#case-insensitive-like), [`e.notILike`](#case-insensitive-not-like), [`e.similarTo`](#similarTo), [`e.notSimilarTo`](#not-similar-to), [`e.match`](#match), [`e.iMatch`](#case-insensitive-match), [`e.notMatch`](#not-match), [`e.notIMatch`](#case-insensitive-not-match)
* **Date/Time** [`e.age`](#age), [`e.now`](#now), [`e.extract`](#extract)

## Values

Create expressions from string, number, boolean, null, or JSON values with `.e`.

```js
sq.return(
  sq.e('hi'),
  sq.e(8),
  sq.e(true),
  sq.e(null),
  sq.e({ a: 1 })
).query

{ text: 'select $1, $2, $3, $4',
  args: ['hi', 8, true, null] }
```

`.e` accepts raw values, expressions, fragments, and subqueries.

```js
sq.return(
  sq.e(sq.raw('1 + 1')),
  sq.e(sq.e(7)),
  sq.e(sq.txt`'bye'`),
  sq.e(sq.sql`select ${8}`),
  sq.e(sq.return(sq.e(9))),
).query

{ text: "select 1 + 1, $1, 'bye', (select $2), (select $3)",
  args: [7, 8, 9] }
```

`.e.eq` builds an equality expression. It accepts two arguments of the same type that `.e` accepts.

```js
sq.return(
  sq.e.eq(sq.raw('genre'), 'fantasy'),
  sq.e.eq('genre', 'history')
).query

{ text: 'select genre = $1, $2 = $3'
  args: ['fantasy', 'genre', 'history']}
```

`.e.eq` can be curried. Give each argument its own function call or template tag.

```js
sq.return(
  sq.e.eq(sq.raw('genre'))('fantasy'),
  sq.e.eq`genre`('history'),
  sq.e.eq`genre``${'art'}`,
).query

{ text: 'select genre = $1, genre = $2, genre = $3',
  args: ['fantasy', 'history', 'art'] }
```

## Logical

### And

`e.and` joins its arguments with `' and '`.

```js
sq.l(e.and(true, false, sq.return`true`)).query

{ text: '$1 and $2 and (select true)',
  args: [true, false] }
```

`e.and` requires at least one argument

```js
sq.l(e.and()).query // throws error
```

`e.and` can be curried.

```js
sq.l(e.and(true)(false)(sq.return`true`)).query

{ text: '$1 and $2 and (select true)',
  args: [true, false] }
```

`e.and` can be called as a template tag.

```js
sq.l(e.and`x`(true)`y`.query

{ text: 'x and $1 and y',
  args: [true] }
```

### Or

`e.or` joins its arguments with `' or '`.

```js
sq.sql(e.or(true, false, sq.return`true`)).query

{ text: '$1 or $2 or (select true)',
  args: [true, false] }
```

`e.or` requires at least one argument

```js
sq.sql(e.or()).query // throws error
```

`e.or` can be curried.

```js
sq.sql(e.or(true)(false)(sq.return`true`)).query

{ text: '$1 or $2 or (select true)',
  args: [true, false] }
```

`e.or` can be called as a template tag.

```js
sq.l(e.or`x`(true)`y`.query

{ text: 'x or $1 or y',
  args: [true] }
```

### Not

`e.not` negates its argument.

```js
sq.sql(e.not(e.and(true, true))).query

{ text: 'not ($1 and $2)',
  args: [true, true] }
```

## Comparison

### Comparison Operators

Sqorn supports binary comparison operators:

Method  | Operator | Operation
--------|----------|----------------------
`e.eq`  | =        | Equal
`e.neq` | <>, !=   | Not Equal
`e.lt`  | <        | Less Than
`e.gt`  | >        | Greater Than
`e.lte` | <=       | Less Than or Equal
`e.gte` | >=       | Greater Than or Equal

Pass exactly two arguments

### Between, Not Between

TODO

### Is Distinct, Is Not Distinct

TODO

### Is Null, Is Not Null

TODO

### True, Not True, False, Not False, Unknown, Not Unknown

TODO

## Math

TODO

## String

TODO

### Like, Not Like

TODO

### Similar To, Not Similar To

TODO

### Regex: ~, ~*, !~, !~*

TODO

## Bit

TODO

## Type Conversions

TODO

## Date and Time

TODO

## Functions

TODO

## Casts

TODO

## Conditional

### Case

TODO

### Coallesce

TODO

### NullIf

TODO

### Greatest

TODO

### Least

TODO

## Aggregate

### Avg

TODO

### Count

TODO

### Min

TODO

### Max

TODO

### Sum

TODO

## Subquery

TODO

## Row and Array

TODO


## Custom Expressions

An expression is a function that takes argument `ctx` and returns the query text.

For example, `.e.eq` is defined as follows:

```js
e.eq = (a, b) => ctx => `(${ctx.build(a)} = ${ctx.build(b)})`
```

```
e.create()
```