---
id: expressions
title: Expressions
sidebar_label: Expressions
---

* **Values** [`e`](#data), [`e.raw`](#raw), [`e.array`](#array), [`e.json`](#json)
* **Logical** [`e.and`](#and), [`e.or`](#or), [`e.not`](#not)
* **Comparison**
  * **Operators** [`e.eq`](#operators), [`e.neq`](#operators), [`e.lt`](#operators), [`e.gt`](#operators), [`e.lte`](#operators), [`e.gte`](#operators)
  * **Between** [`e.between`](#between), [`e.notBetween`](#between)
  * **Distinct** [`e.isDistinctFrom`](#is-distinct-from), [`e.isNotDistinctFrom`](#is-distinct-from)
  * **Null** [`e.isNull`](#is-null), [`e.isNotNull`](#is-null)
  * **Boolean** [`e.isTrue`](#is-true-is-false-is-unknown), [`e.isNotTrue`](#is-true-is-false-is-unknown), [`e.isFalse`](#is-true-is-false-is-unknown), [`e.isNotFalse`](#is-true-is-false-is-unknown), [`e.isUnknown`](#is-true-is-false-is-unknown), [`e.isNotUnknown`](#is-true-is-false-is-unknown)
* **Subquery** [`e.exists`](#exists), [`e.notExists`](#not-exists), [`e.in`](#in), [`e.notIn`](#not-in), [`e.any`](#any), [`e.some`](#some), [`e.all`](#all)
* **Row and Array** [`e.in`](#in), [`e.notIn`](#not-in`), [`e.any`](#any), [`e.some`](#some), [`e.all`](#all), [`e.row`](#row), [`e.array`](#array)
* **Math**
  * **Operators** [`e.add`](#add), [`e.subtract`](#subtract), [`e.multiply`](#multiply), [`e.divide`](#divide), [`e.mod`](#modulo), [`e.exp`](#exponentiation), [`e.sqrt`](#square-root), [`e.cbrt`](#cube-root), [`e.factorial`](#factorial), [`e.abs`](#absolute-value)
  * **Binary** [`e.binary`](#binary), [`e.andb`](#binary-and), [`e.orb`](#binary-or), [`e.xorb`](#binary-xor), [`e.notb`](#binary-not), [`e.shiftLeft`](#shift-left), [`e.shiftRight`](#shift-right)
* **Aggregate** [`e.count`](#count), [`e.sum`](#sum), [`e.avg`](#average), [`e.min`](#min), [`e.max`](#max), [`e.stddev`](#standard-deviation), [`e.variance`](#variance)
* **Conditional** [`.case`](#case), [`e.coallesce`](#coallesce), [`e.nullif`](#nullif), [`e.greatest`](#greatest), [`e.least`](#least)
* **String** [`e.concat`](#string-concatenation), [`e.substring`](#substring), [`e.length`](#length), [`e.bitLength`](#bit-length), [`e.charLength`](#charLength), [`e.lower`](#lower), [`e.upper`](#upper), [`e.like`](#like), [`e.notLike`](#not-like), [`e.iLike`](#case-insensitive-like), [`e.notILike`](#case-insensitive-not-like), [`e.similarTo`](#similarTo), [`e.notSimilarTo`](#not-similar-to), [`e.match`](#match), [`e.iMatch`](#case-insensitive-match), [`e.notMatch`](#not-match), [`e.notIMatch`](#case-insensitive-not-match)
* **Date/Time** [`e.age`](#age), [`e.now`](#now), [`e.extract`](#extract)

## Introduction

Builds complex expressions with Sqorn's Expression Builder.

Access the expression API at `sq.e`.

Expressions can be nested.

```js
const { e } = sq

sq.sql(
    e.and(
      e.or(
        e.lt(3, 4),
        e.gt(5, 6)
      ),
      e.neq(7, 8)
    )
  )
  .query

{ text: '(($1 < $2) or ($3 > $4)) and ($5 <> $6)',
  args: [3, 4, 5, 6, 7, 8] }
```

Expressions can be chained, curried and called as tagged templates.

A chained expression's first argument is the previous expression.

```js
sq.sql(
    e(3).lt(4).or(e(5).gt(6)).and(e`7`.neq`8`)
  )
  .query

{ text: '(($1 < $2) or ($3 > $4)) and (7 <> 8)',
  args: [3, 4, 5, 6, 7, 8] }
```

Expressions are functions that accept values, expressions, fragments and subqueries.

```js
sq.sql(
    e('hello'),
    e(e(1)),
    e(sq.txt`2`),
    e(sq.return`3`)
  )
  .query

{ text: '($1, $2, 2, (select 3))',
  args: ['hello', 1] }
```

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

* `and => ...boolean => boolean`
* `or => ...boolean => boolean`
* `not => boolean => boolean`

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