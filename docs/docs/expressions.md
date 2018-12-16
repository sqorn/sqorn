---
id: expressions
title: Expressions
sidebar_label: Expressions
---

## Introduction

Builds complex expressions with Sqorn's Expression Builder.

Access the expression API at `sq.e`.

Create expressions by applying [Operations](operations) like `.add`, `.and`, and `.eq` to values.

```js
const { e } = sq

e.add(3, 4).query

{ text: '$1 + $2',
  args: [3, 4] }
```

Create an expression from a value with `.arg`.

```js
e.arg('meow').query

{ text: '$1',
  args: ['meow'] }
```

`e` is short hand for `e.arg`.

```js
e('meow').query

{ text: '$1',
  args: ['meow'] }
```

Expressions are values.

```js
e(e(23)).query

{ text: '$1',
  args: [23] }
```

Expressions are immutable and composable.

```js
e.and(
  e.or(e.lt(3, 4), e.gt(5, 6)),
  e.neq(7, 8)
).query

{ text: '(($1 < $2) or ($3 > $4)) and ($5 <> $6)',
  args: [3, 4, 5, 6, 7, 8] }
```

All *Operations* have curried overloads.

```js
e.add(3)(4).query

{ text: '$1 + $2',
  args: [3, 4] }
```

Supply raw arguments with tagged template literals.

```js
e.eq`lucky_number`(8).query

{ text: 'lucky_number = $1',
  args: [8] }
```

A chained operation's first argument is the expression it is called on.

```js
e(3).add(4).eq(7).and(true).query

{ text: '(($1 + $2) = $3) and $4',
  args: [3, 4, 7, true] }
```

Pass multiple arguments to `.arg` to build a row value.

```js
e.arg(8, true)`meow`.query

{ text: '($1, $2, meow)',
  args: [8, true]}
```

Build expressions from [Fragments](manual-queries.html#fragments) and [Subqueries](manual-queries.html#subqueries).

```js
e(sq.txt`2`), sq.return`3`).query

{ text: '(2, (select 3))',
  args: [] }
```

## Types

SQL is strongly typed. Sqorn expressions are somewhat typed.

Typescript users will suffer compilation errors if they try to apply operations to incompatible types. For example, `.add` expects numbers and expressions that resolve to numbers. Supplying a string or boolean instead will not work.

There are limitations to Sqorn's type safety:

* The type of a `null` value cannot be inferred. Creating an expression from a null value will generate an [Unknown Expression](#unknown).

* The type of a tagged template literal cannot be inferred. Creating an expression from a tagged template literal will generate an [Unknown Expression](#unknown).

* Multidimensional types like Array Expression, Row Expression and Table Expression lose all information about their constituent types. Sqorn won't warn you if you build the following expression: `e.eq(e(true, false), e(3, 4))`.

Note that in Typescript, types exist at compile time, not run time.

### Boolean

Boolean Expressions represent values true and false.

They are useful for constructing *where*, *having* and *join* conditions.

**Compatible Types:** `boolean`, `null`, `BooleanExpression`, `UnknownExpression`

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [Logical](#logical)

### Number

Number Expressions represent numbers like `2`, `70.5`, and `-2749.234`.

**Compatible Types:** `number`, `null`, `NumberExpression`, `UnknownExpression`

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [Math](#math)

### String

String Expressions represent character sequences like `'kitty'`, `'Tuxedo cats are best'`, and `''`.

**Compatible Types:** `string`, `null`, `StringExpression` and `UnknownExpression`

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [String](#string)

### Unknown

Unknown Expressions represent values of unknown type. They could be anything from `true`, `null`, and `'meow'`, to `(true, 24)`, `Array[3, 5, 7]`, and `'{ "hello": "world" }'`.

**Compatible Types:** `any`

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [Logical](#logical), [Math](#math), [String](#string), [Array](#array), [Row](#row), [Table](#table)

### Array

Array Expressions represent [Postgres Arrays](https://www.postgresql.org/docs/current/arrays.html).

**Compatible Types:** `any[]`, `null`, `Array Expression`, `Unknown Expression` 

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [Array](#array)

### JSON

JSON Expressions represent JSON values.

**Compatible Types:** `{}`, `null`, `JSONExpression`, `UnknownExpression`

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [JSON](#json)

### Row

Row Expressions represent one or more values of any type.

**Compatible Types:** `null`, `Row Expression`, `Unknown Expression`

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [Row](#row)

### Table

Table Expressions represent a table.

**Compatible Types:** `null`, `SQ`, `Table Expression`, `Unknown Expression`

**Supported Operations:** [Comparison](#comparison), [Membership](#membership), [Table](#table)


## About Null


Unless otherwise noted, all expression function can be curried and called as template tags.

```js
sq.sql(
    e.eq(1)(2),
    e.gte`count`(3),
    e.and(true)`false`(false)
  )
  .query

{ text: '(($1 = $2), (count >= $3), ($4 and (false) and $5))',
  args: [1, 2, 3, true, false] }
```

## Values

### Argument

Create expressions from string, number, boolean, null, or objects with `e`.

```js
sq.return(
  e('hi'),
  e(8),
  e(true),
  e(null),
  e({ a: 1 })
).query

{ text: 'select $1, $2, $3, $4',
  args: ['hi', 8, true, null] }
```

Pass `e` multiple arguments to build a row.

```js
sq.sql(e('hello', e.raw('world'), 2)).query

{ text: '($1, world, $2)',
  args: ['hello', 2] }
```

Curry `e`.

```js
sq.sql(e('c')`is``for`('cookies')).query

{ text: '($1, is, for, $2)',
  args: ['c', 'cookies'] }
```

### Raw

`e.raw` interprets its arguments as unparameterized values.

```js
sq.sql(e.raw('hi')).query

{ text: 'hi',
  args: [] }
```

Pass `e.raw` multiple arguments to build a row.

```js
sq.sql(e.raw('hello', e('world'), 2)).query

{ text: '(hello, $1, 2)',
  args: ['world'] }
```

Curry `e.raw`.

```js
sq.sql(e.raw('c')`is``for`('cookies')).query

{ text: '(c, is, for, cookies)',
  args: [] }
```

### Array

`e.array`

TODO

### JSON

`e.json`

TODO

## Logical

* `and => boolean => ...boolean => boolean`
* `or => boolean => ...boolean => boolean`
* `not => boolean => boolean`

### And

`e.and` joins its arguments with `' and '`.

```js
sq.sql(e.and(true, false, sq.return`true`)).query

{ text: '$1 and $2 and (select true)',
  args: [true, false] }
```

`e.and` requires at least one argument

```js
sq.sql(e.and()).query // throws error
```

`e.and` can be curried.

```js
sq.sql(e.and(true)(false)(sq.return`true`)).query

{ text: '$1 and $2 and (select true)',
  args: [true, false] }
```

`e.and` can be called as a template tag.

```js
sq.sql(e.and`x`(true)`y`.query

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
sq.sql(e.or`x`(true)`y`.query

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

* `eq => T => T => boolean`
* `neq => T => T => boolean`
* `lt => T => T => boolean`
* `gt => T => T => boolean`
* `lte => T => T => boolean`
* `gte => T => T => boolean`
* `between => T => T => T => boolean`
* `notBetween => T => T => T => boolean`
* `isDistinctFrom => T => T => boolean`
* `isNotDistinctFrom => T => T => boolean`
* `isNull => T => boolean`
* `isNotNull => T => boolean`
* `isTrue => T => boolean`
* `isNotTrue => T => boolean`
* `isFalse => T => boolean`
* `isNotFalse => T => boolean`
* `isUnknown => T => boolean`
* `isNotUnknown => T => boolean`

### Operators

Build =, <>, <, >, <=, and >= operations with `e.eq`, `e.neq`, `e.lt`, `e.gt`, `e.lte`, `e.gte`.

Pass two arguments.

```js
sq.sql(
  e.eq(e.raw`title`, 'The Way of Kings'),
  e.neq(true, false),
  e.lt(4, 8),
  e.gt(e.raw('likes'), 1000),
  e.lte(3, 4),
  e.gte(6, 9),
).query

{ text: '((title = $1), ($2 <> $3), ($4 < $5), (likes > $6), ($7 <= $8), ($9 >= $10))',
  args: ['The Way of Kings', true, false, 4, 8, 1000, 3, 4, 6, 9] }
```

Curry arguments.

```js
sq.return(
  e.eq(sq.raw('genre'))('fantasy'),
  e.eq`genre`('history'),
  e.eq`genre``${'art'}`,
).query

{ text: 'select genre = $1, genre = $2, genre = $3',
  args: ['fantasy', 'history', 'art'] }
```

### Between

`e.between` and `e.notBetween` check if a value is between two others.

```js
sq.sql(e.between(5, 1, 10)).query

{ text: '$1 between $2 and $3',
  args: [5, 1, 10] }
```

Curry arguments.

```js
sq.sql(e(5).notBetween`7`(10)).query

{ text: '$1 not between 7 and $3',
  args: [5, 10] }
```

### Is Distinct From

`e.isDistinctFrom` and `e.isNotDistinctFrom` compare two arguments for equivalence.

Expression | Result
-|-
null = null | null
null <> null | null
null is distinct from null | false
null is not distinct from null | true

```js
sq.sql(e.isDistinctFrom(null, null)).query

{ text: '$1 is distinct from $1',
  args: [null, null] }
```

Curry arguments.

```js
sq.sql(e(3).isNotDistinctFrom`4`)

{ text: '$1 is not distinct from 4',
  args: [3] }
```

### Is Null

`e.isNull` and `e.isNotNull` check if a value is null. If the argument is a row, they check if the row is null or all of its fields are null.


```js
sq.sql(e.isNull(null), e`moo`.isNotNull)

{ text: '($1 is null, moo is not null)',
  args: [null] }
```

### Is True, Is False, Is Unknown

`e.isTrue`, `.isNotTrue`, `e.isNotFalse`, `e.isNotFalse`, `e.isUnknown`, and `e.isNotUnknown` are unary comparison expressions.

```js
sq.sql(
    e.isTrue(true),
    e(true).isNotTrue,
    e.isFalse(null)
    e.isNotFalse`moo`,
    e(null).isUnknown,
    e`moo`.isNotUnknown
  )
  .query

{ text: '($1 is true, $2 is not true, $3 is false, moo is not false, $4 is unknown, moo is not unknown)',
  args: [true, true, null, null] }
```

`e.isUnknown` and `e.isNotUnknown` require boolean arguments but are otherwise equivalent to `e.isNull` and `e.isNotNull`.

## Math

### Operators

Build +, -, *, /, and % (modulus) operations with `e.add`, `e.subtract`, `e.multiply`, and `e.divide`.

```js

{ text: '',
  args: [] }
```



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