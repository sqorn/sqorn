---
id: operations
title: Operations
sidebar_label: Operations
---

**Reference** [Postgres](https://www.postgresql.org/docs/current/functions.html), [SQLite](https://www.sqlite.org/lang_expr.html), [MySQL](https://dev.mysql.com/doc/refman/en/functions.html), [T-SQL](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/expressions-transact-sql), [Oracle](https://docs.oracle.com/cd/E11882_01/server.112/e41084/operators.htm)

## Overview

* **Value** [`arg`](#arg) [`unknown`](#unknown) [`boolean`](#boolean) [`number`](#number) [`string`](#string) [`array`](#array) [`json`](#json) [`row`](#row) [`table`](#table)
* **Boolean** [`and`](#and) [`or`](#or) [`not`](#not) [`isTrue`](#is-true) [`isNotTrue`](#is-not-true) [`isFalse`](#is-false) [`isNotFalse`](#is-not-false) [`isUnknown`](#is-unknown) [`isNotUnknown`](#is-not-unknown)
* **Comparison** [`eq`](#equal) [`neq`](#not-equal) [`lt`](#less-than) [`gt`](#greater-than) [`lte`](#less-than-or-equal) [`gte`](#greater-than-or-equal) [`between`](#between) [`notBetween`](#not-between) [`isDistinctFrom`](#is-distinct-from) [`isNotDistinctFrom`](#is-not-distinct-from) [`isNull`](#is-null) [`isNotNull`](#is-not-null) [`in`](#in) [`notIn`](#not-in)
* **Quantified Comparison** [`eqAny`](#equal-any) [`eqAll`](#equal-all) [`neqAny`](#equal-any) [`neqAll`](#not-equal-all) [`ltAny`](#less-than-any) [`ltAll`](#less-than-all) [`gtAny`](#greater-than-any) [`gtAll`](#greater-than-all) [`lteAny`](#less-than-or-equal-any) [`lteAll`](#less-than-or-equal-all) [`gteAny`](#greater-than-or-equal-any) [`gteAll`](#greater-than-or-equal-all)
* **Math** [`add`](#-add) [`sub`](#subtract) [`mul`](#multiply) [`div`](#divide) [`mod`](#modulo) [`exp`](#exponent) [`sqrt`](#square-root) [`cbrt`](#cube-root) [`fact`](#factorial)
* **String** [`cat`](#concatenation) [`like`](#like) [`notLike`](#not-like) [`likeAny`](#like-any) [`likeAll`](#like-all) [`notLikeAny`](#not-like-any) [`notLikeAll`](#not-like-all) [`similarTo`](#similar-to) [`notSimilarTo`](#not-similar-to) [`lower`](#lower) [`upper`](#upper)
* **Date and Time** [`age`](#age) [`now`](#now) [`extract`](#extract)
* **Range**
* **Aggregate** [`count`](#count) [`sum`](#sum) [`avg`](#average) [`min`](#min) [`max`](#max) [`stddev`](#standard-deviation) [`variance`](#variance)
* **Conditional** [`case`](#case) [`coalesce`](#coalesce) [`nullif`](#nullif) [`greatest`](#greatest) [`least`](#least)
* **Array** [`cat`](#concatenation-operator-1) [`arrayCat`](#array-cat) [`arrayGet`](#array-get) [`arrayAppend`](#array-append) [`unnest`](#unnest) 
* **JSON**
* **Binary** [`and`](#and-1) [`or`](#or-1) [`xor`](#xor-1) [`not`](#not-1) [`shiftLeft`](#shift-left) [`shiftRight`](#shift-right)
* **Table** [`union`](#union) [`except`](#except) [`except-all`](#except-all) [`unionAll`](#union-all) [`intersect`](#intersect) [`intersectAll`](#intersect-all) 

## Value

### Arg

* `arg: T => T`
* `arg: T1 => T2 => ... Tn => row`

`.arg` builds an expression from its argument.

```js
e.arg(23).query

{ text: '$1',
  args: [23] }
```

The argument determines the return type.

```js
e.arg(23)                 // NumberExpression
e.arg(true)               // BooleanExpression
e.arg(null)               // UnknownExpression
e.arg('adsf')             // StringExpression
e.arg`hello`              // UnknownExpression
e.arg([1, 2])             // ArrayExpression
e.arg({ hello: 'world' }) // JSONExpression
e.arg(e.arg(23))          // NumberExpression
```

Multiple arguments build a [Row Expression](expressions#row).

```js
e.arg(23, true)             // RowExpression
e.arg('moo', 'moo', 'meow') // RowExpression
e.arg('moo')('moo')         // RowExpression
e.arg`moo``moo`('meow')     // RowExpression
```

`e` is shorthand for `e.arg`.

```js
e(23)   // NumberExpression
e(true) // BooleanExpression
```

Like other operations `.arg` takes the expression it is called on its first argument.

```js
e(12).arg(23).arg(45)        // equivalent to below
e.arg(e.arg(e(12))(23))(45)  // equivalent to above
```

### Unknown

* `unknown: any => unknown`

`.unknown` builds an [Unknown Expression](expressions#unknown).

```js
e.unknown(true)     // UnknownExpression
e.unknown(23)       // UnknownExpression
e.unknown(null)     // UnknownExpression
e.unknown(e('moo')) // UnknownExpression
e.unknown`moo`      // UnknownExpression
```

Avoid using `.unknown`. It is an escape hatch from Sqorn's Type System. Any operation is possible on an Unknown Expression.

```js
e.unknown(true).add(23)
```

### Boolean

* `boolean: boolean => boolean`

`.boolean` builds a [Boolean Expression](expressions#boolean).

```js
e.boolean(true)    // BooleanExpression
e.boolean(false)   // BooleanExpression
e.boolean(null)    // BooleanExpression
e.boolean(e(true)) // BooleanExpression
e.boolean`moo`     // BooleanExpression
```

### Number

* `number: number => number`

`.number` builds a [Number Expression](expressions#number).

```js
e.number(23)      // NumberExpression
e.number(-999.23) // NumberExpression
e.number(null)    // NumberExpression
e.number(e(0))    // NumberExpression
e.number`moo`     // NumberExpression
```

### String

* `string: string => string`

`.string` builds a [String Expression](expressions#string).

```js
e.string('adsf')    // StringExpression
e.string('moo moo') // StringExpression
e.string(null)      // StringExpression
e.string(e('moo'))  // StringExpression
e.string`moo`       // StringExpression
```

### Array

* `array: array => array`

`.string` builds an [Array Expression](expressions#array).

```js
e.array([])                  // ArrayExpression
e.array([2, 3, 5])           // ArrayExpression
e.array(['moo', 'moo'])      // ArrayExpression
e.array(null)                // ArrayExpression
e.array(e([]))               // ArrayExpression
e.array`array['moo', 'moo']` // ArrayExpression
```

### JSON

* `json: json => json`

`.json` builds a [JSON Expression](expressions#json).

```js
e.json({ a: 'hi' }) // JSONExpression
e.json([23])        // JSONExpression
e.json(true)        // JSONExpression
e.json(23)          // JSONExpression
e.json('moo')       // JSONExpression
e.json(null)        // JSONExpression
e.json(e({}))       // JSONExpression
e.json`moo`         // JSONExpression
```

### Row

* `row: row => row`
* `row: T1 => T2 => ...Tn => row`

`.row` builds a [Row Expression](expressions#row).

```js
e.row(true, 23)       // RowExpression
e.row('moo', 'moo')   // RowExpression
e.row(true)           // RowExpression
e.row(23)             // RowExpression
e.row('moo')          // RowExpression
e.row(null)           // RowExpression
e.row(e.row(1, 2))    // RowExpression
e.row(1, true, 'moo') // RowExpression
e.row(1)(true)('moo') // RowExpression
e.row`moo`            // RowExpression
```

### Table

* `table: table => table`

`.table` builds a [Table Expression](expressions#table).

```js
e.table(null)                // TableExpression
e.table(sq.from('book'))     // TableExpression
e.table`moo`                 // TableExpression
e.table(e.table`moo`)        // TableExpression
e.table(e.unnest([1, 2, 3])) // TableExpression
```

## Boolean

### And

* `and: boolean => ...boolean => boolean`

`.and` performs logical conjunction on its arguments.

```js
e.and(true, false).query

{ text: '$1 and $2',
  args: [true, false] }
```

At least one argument is required.

```js
e.and().query // throws error

e.and(true).query

{ text: '$1',
  args: [true] }
```

More than two arguments is allowed.

```js
e.and(true, false, true, false).query

{ text: '$1 and $2 and $3 and $4',
  args: [true, false, true, false] }
```

Chain and curry `.and`.


```js
e(true).and(false)(true).and`moo`.query

{ text: '$1 and $2 and $3 and moo',
  args: [true, false, true, true] }
```

### Or

* `or: boolean => ...boolean => boolean`

`.or` performs logical disjunction on its arguments.

```js
e.or(true, false).query

{ text: '$1 or $2',
  args: [true, false] }
```

At least one argument is required.

```js
e.or().query // throws error

e.or(true).query

{ text: '$1',
  args: [true] }
```

More than two arguments is allowed.

```js
e.or(true, false, true, false).query

{ text: '$1 or $2 or $3 or $4',
  args: [true, false, true, false] }
```

Chain and curry `.or`.


```js
e(true).or(false)(true).or`moo`.query

{ text: '$1 or $2 or $3 or moo',
  args: [true, false, true, true] }
```

### Not

* `not: boolean => boolean`

`.not` performs logical negation on its argument.

```js
e.not(true).query

{ text: 'not($1)',
  args: [true] }
```

Chaining `.not` negates the Expression it is called on

```js
e`moo`.not.query

{ text: 'not(moo)',
  args: [] }
```

### Is True

* `isTrue: boolean => boolean`

`.isTrue` returns whether its argument is true.

Expression | Result
-|-
true is true | true
false is true | false
null is true | false

```js
e.isTrue(true).query

{ text: '$1 is true',
  args: [true] }
```

Chain `.isTrue`.
```js
e`moo`.isTrue.query

{ text: 'moo is true',
  args: [] }
```

### Is Not True

* `isNotTrue: boolean => boolean`

`.isNotTrue` returns whether its argument is *not* true.

Expression | Result
-|-
true is not true | false
false is not true | true
null is not true | true

```js
e.isNotTrue(true).query

{ text: '$1 is not true',
  args: [true] }
```

Chain `.isNotTrue`.
```js
e`moo`.isNotTrue.query

{ text: 'moo is not true',
  args: [] }
```

### Is False

* `isFalse: boolean => boolean`

`.isFalse` returns whether its argument is false.

Expression | Result
-|-
true is false | false
false is false | true
null is false | false

```js
e.isFalse(true).query

{ text: '$1 is false',
  args: [true] }
```

Chain `.isFalse`.
```js
e`moo`.isFalse.query

{ text: 'moo is false',
  args: [] }
```

### Is Not False

* `isNotFalse: boolean => boolean`

`.isNotFalse` returns whether its argument is *not* false.

Expression | Result
-|-
true is not false | true
false is not false | false
null is not false | true

```js
e.isNotFalse(true).query

{ text: '$1 is not false',
  args: [true] }
```

Chain `.isNotFalse`.
```js
e`moo`.isNotFalse.query

{ text: 'moo is not false',
  args: [] }
```

### Is Unknown

* `isUnknown: boolean => boolean`

`.isUnknown` returns whether its argument is null.

`.isUnknown` is equivalent to [`.isNull`](#is-null), except its arguments must be boolean.

Expression | Result
-|-
true is unknown | false
false is unknown | false
null is unknown | true

```js
e.isUnknown(true).query

{ text: '$1 is unknown',
  args: [true] }
```

Chain `.isUnknown`.
```js
e`moo`.isUnknown.query

{ text: 'moo is unknown',
  args: [] }
```

### Is Not Unknown

* `isNotUnknown: boolean => boolean`

`.isNotUnknown` returns whether its argument is *not* null.

`.isNotUnknown` is equivalent to [`.isNotNull`](#is-not-null), except its argument must be boolean.

Expression | Result
-|-
true is not unknown | true
false is not unknown | true
null is not unknown | false

```js
e.isNotUnknown(true).query

{ text: '$1 is not unknown',
  args: [true] }
```

Chain `.isNotUnknown`.
```js
e`moo`.isNotUnknown.query

{ text: 'moo is not unknown',
  args: [] }
```

## Comparison

### Equal

* `eq: T => T => boolean`

`.eq` returns whether its arguments are equal.

```js
e.eq('moo', 'moo').query

{ text: '$1 = $2',
  args: ['moo', 'moo'] }
```

Chain and curry `.eq`.

```js
e`moo`.eq`moo`.query

{ text: 'moo = moo',
  args: [] }
```

### Not Equal

* `neq: T => T => boolean`

`.neq` returns whether its arguments are *not* equal.

```js
e.neq('moo', 'moo').query

{ text: '$1 <> $2',
  args: ['moo', 'moo'] }
```

Chain and curry `.neq`.

```js
e`moo`.neq`moo`.query

{ text: 'moo <> moo',
  args: [] }
```

### Less Than

* `lt: T => T => boolean`

`.lt` returns whether its first argument is less than its second argument.

```js
e.lt('moo', 'moo').query

{ text: '$1 < $2',
  args: ['moo', 'moo'] }
```

Chain and curry `.lt`.

```js
e`moo`.lt`moo`.query

{ text: 'moo < moo',
  args: [] }
```

### Greater Than

* `gt: T => T => boolean`

`.gt` returns whether its first argument is greater than its second argument.

```js
e.gt('moo', 'moo').query

{ text: '$1 > $2',
  args: ['moo', 'moo'] }
```

Chain and curry `.gt`.

```js
e`moo`.gt`moo`.query

{ text: 'moo > moo',
  args: [] }
```

### Less Than or Equal

* `lte: T => T => boolean`

`.lte` returns whether its first argument is less than or equal to its second argument.

```js
e.lte('moo', 'moo').query

{ text: '$1 <= $2',
  args: ['moo', 'moo'] }
```

Chain and curry `.lte`.

```js
e`moo`.lte`moo`.query

{ text: 'moo <= moo',
  args: [] }
```

### Greater Than or Equal

* `gte: T => T => boolean`

`.gte` returns whether its first argument is greater than or equal to its second argument.

```js
e.gte('moo', 'moo').query

{ text: '$1 >= $2',
  args: ['moo', 'moo'] }
```

Chain and curry `.gte`.

```js
e`moo`.gte`moo`.query

{ text: 'moo >= moo',
  args: [] }
```

### Between

* `between: T => T => T => boolean`

`.between` returns whether its first argument is between its second and third arguments.

```js
e.between(5, 3, 9).query

{ text: '$1 between $2 and $3',
  args: [5, 3, 9] }
```

Chain and curry `.between`.

```js
e`moos`.between(3)(7).query

{ text: 'moomoo between $1 and $2',
  args: [3, 7] }
```

### Not Between

* `notBetween: T => T => T => boolean`

`.notBetween` returns whether its first argument is *not* between its second and third arguments.

```js
e.notBetween(5, 3, 9).query

{ text: '$1 not between $2 and $3',
  args: [5, 3, 9] }
```

Chain and curry `.notBetween`.

```js
e`moos`.between(3)(7).query

{ text: 'moomoo not between $1 and $2',
  args: [3, 7] }
```

### Is Distinct From

* `isDistinctFrom: T => T => boolean`

`.isDistinctFrom` returns whether its arguments are distinct. It is equivalent to `.neq` except it treats `null` a value.

Expression | Result
-|-
null <> null | null
null is distinct from null | false

```js
e.isDistinctFrom(3, null).query

{ text: '$1 is distinct from $2',
  args: [3, null] }
```

Chain and curry `.isDistinctFrom`.

```js
e`moo`.isDistinctFrom('moo').query

{ text: 'moom is distinct from $1',
  args: ['moo'] }
```

### Is Not Distinct From

* `isNotDistinctFrom: T => T => boolean`

`.isNotDistinctFrom` returns whether its arguments are *not* distinct. It is equivalent to `.eq` except it treats `null` a value.

Expression | Result
-|-
null = null | null
null is not distinct from null | true

```js
e.isNotDistinctFrom(3, null).query

{ text: '$1 is not distinct from $2',
  args: [3, null] }
```

Chain and curry `.isNotDistinctFrom`.

```js
e`moo`.isNotDistinctFrom('moo').query

{ text: 'moom is not distinct from $1',
  args: ['moo'] }
```

### Is Null

* `isNull: T => boolean`

`.isNull` returns whether its argument is null.

Expression | Result
-|-
true is null | false
false is null | false
null is null | true

```js
e.isNull(null).query

{ text: '$1 is null',
  args: [null] }
```

Chain `.isNull`.
```js
e`moo`.isNull.query

{ text: 'moo is null',
  args: [] }
```

### Is Not Null

* `isNotNull: T => boolean`

`.isNull` returns whether its argument is *not* null.

Expression | Result
-|-
true is not null | true
false is not null | true
null is not null | false

```js
e.isNotNull(null).query

{ text: '$1 is not null',
  args: [null] }
```

Chain `.isNotNull`.
```js
e`moo`.isNotNull.query

{ text: 'moo is not null',
  args: [] }
```

### In

* `in: T => T[] => boolean`
* `in: T => table => boolean`

Form 1. `.in` returns whether a value is in a *Values List*.

```js
e.in(7, [5, 6, 7]).query

{ text: '$1 in ($2, $3, $4)',
  args: [7, 5, 6, 7] }
```

Form 2. `.in` returns whether a value is in a *Table*.

```js
e.in(7, sq.sql`select 5 union (select 6) union (select 7)`).query

{ text: '$1 in (select 5 union (select 6) union (select 7))',
  args: [7] }
```

`.in` is equivalent to [`.eqAny`](#equal-any) when the second argument is a table, but their overloads are different. `.in` independently parameterizes each entry of its Values List. `.eqAny` generates a single parameter from it Postgres Array.

```js
e.in(4, [3, 4, 5]).query

{ text: '$1 in ($2, $3, $4)',
  args: [4, 3, 4, 5] }

e.eqAny(4, [3, 4, 5]).query

{ text: '$1 = any($2)',
  args: [4, [3, 4, 5]] }
```

### Not In

* `notIn: => T => table => boolean`
* `notIn: => T => T[] => boolean`

Form 1. `.notIn` returns whether a value is *not* in a *Values List*.

```js
e.notIn(7, [5, 6, 7]).query

{ text: '$1 not in ($2, $3, $4)',
  args: [7, 5, 6, 7] }
```

Form 2. `.notIn` returns whether a value is *not* in a *Table*.

```js
e.notIn(7, sq.sql`select 5 union (select 6) union (select 7)`).query

{ text: '$1 not in (select 5 union (select 6) union (select 7))',
  args: [7] }
```

`.notIn` is equivalent to [`.neqAll`](#not-equal-all) when the second argument is a table, but their overloads are different. `.notIn` independently parameterizes each entry of its Values List. `.neqAll` generates a single parameter from it Postgres Array.

```js
e.notIn(4, [3, 4, 5]).query

{ text: '$1 not in ($2, $3, $4)',
  args: [4, 3, 4, 5] }

e.neqAll(4, [3, 4, 5]).query

{ text: '$1 <> all($2)',
  args: [4, [3, 4, 5]] }
```

## Quantified Comparison

### Equal Any

* `eqAny: T => array => boolean`
* `eqAny: T => table => boolean`

Form 1. `.eqAny` returns whether a value is equal to any member of an *Array*.

```js
e.eqAny(7, [4, 5, 9]).query

{ text: '$1 = any($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.eqAny` returns whether a value is equal to any row of a *Table*.

```js
e.eqAny(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 = any((select 5 union (select 7)))",
  args: [6] }
```

`.eqAny` is equivalent to [`.in`](#in) when the second argument is a table, but their overloads are different. `.eqAny` generates a single parameter from it Postgres Array. `.in` independently parameterizes each entry of its Values List.

```js
e.eqAny(4, [3, 4, 5]).query

{ text: '$1 = any($2)',
  args: [4, [3, 4, 5]] }

e.in(4, [3, 4, 5]).query

{ text: '$1 in ($2, $3, $4)',
  args: [4, 3, 4, 5] }
```


### Equal All

* `eqAll: T => array => boolean`
* `eqAll: T => table => boolean`

Form 1. `.eqAll` returns whether a value is equal to all members of an *Array*.

```js
e.eqAll(7, [7, 7, 7]).query

{ text: '$1 = all($2))',
  args: [7, [7, 7, 7]] }
```

Form 2. `.eqAll` returns whether a value is equal to all rows of a *Table*.

```js
e.eqAll(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 = all((select 5 union (select 7)))",
  args: [6] }
```

`.eqAll` is *not* equivalent to [`.in`](#in). Try [`.eqAny`](#equal-any) instead.

### Not Equal Any

* `neqAny: T => array => boolean`
* `neqAny: T => table => boolean`

Form 1. `.neqAny` returns whether a value is *not* equal to any member of an *Array*.

```js
e.neqAny(7, [4, 5, 9]).query

{ text: '$1 <> any($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.neqAny` returns whether a value is equal *not* to any row of a *Table*.

```js
e.neqAny(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 <> any((select 5 union (select 7)))",
  args: [6] }
```

`.neqAny` is *not* equivalent to [`.notIn`](#in). Try [`.neqAll`](#not-equal-all) instead.

### Not Equal All

* `neqAll: T => array => boolean`
* `neqAll: T => table => boolean`

Form 1. `.neqAll` returns whether a value is *not* equal to all members of an *Array*.

```js
e.neqAll(7, [7, 7, 7]).query

{ text: '$1 <> all($2))',
  args: [7, [7, 7, 7]] }
```

Form 2. `.neqAll` returns whether a value is *not* equal to all rows of a *Table*.

```js
e.neqAll(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 <> all((select 5 union (select 7)))",
  args: [6] }
```

`.notEqAll` is equivalent to [`.notIn`](#not-in) when the second argument is a table, but their overloads are different. `.neqAll` generates a single parameter from it Postgres Array. `.notIn` independently parameterizes each entry of its Values List.

```js
e.neqAll(4, [3, 4, 5]).query

{ text: '$1 <> all($2)',
  args: [4, [3, 4, 5]] }

e.notIn(4, [3, 4, 5]).query

{ text: '$1 not in ($2, $3, $4)',
  args: [4, 3, 4, 5] }
```

### Less Than Any

* `ltAny: T => array => boolean`
* `ltAny: T => table => boolean`

Form 1. `.ltAny` returns whether a value is less than any member of an *Array*.

```js
e.ltAny(7, [4, 5, 9]).query

{ text: '$1 < any($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.ltAny` returns whether a value is less than any row of a *Table*.

```js
e.ltAny(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 < any((select 5 union (select 7)))",
  args: [6] }
```

### Less Than All

* `ltAll: T => array => boolean`
* `ltAll: T => table => boolean`

Form 1. `.ltAll` returns whether a value is less than all members of an *Array*.

```js
e.ltAll(7, [4, 5, 9]).query

{ text: '$1 < all($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.ltAll` returns whether a value is less than all rows of a *Table*.

```js
e.ltAll(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 < all((select 5 union (select 7)))",
  args: [6] }
```

### Greater Than Any

* `gtAny: T => array => boolean`
* `gtAny: T => table => boolean`

Form 1. `.gtAny` returns whether a value is greater than any member of an *Array*.

```js
e.gtAny(7, [4, 5, 9]).query

{ text: '$1 > any($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.gtAny` returns whether a value is greater than any row of a *Table*.

```js
e.gtAny(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 > any((select 5 union (select 7)))",
  args: [6] }
```

### Greater Than All

* `gtAll: T => array => boolean`
* `gtAll: T => table => boolean`

Form 1. `.gtAll` returns whether a value is greater than all members of an *Array*.

```js
e.gtAll(7, [4, 5, 9]).query

{ text: '$1 > all($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.gtAll` returns whether a value is greater than all rows of a *Table*.

```js
e.gtAll(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 > all((select 5 union (select 7)))",
  args: [6] }
```

### Less Than or Equal Any

* `lteAny: T => array => boolean`
* `lteAny: T => table => boolean`

Form 1. `.lteAny` returns whether a value is less than or equal to any member of an *Array*.

```js
e.lteAny(7, [4, 5, 9]).query

{ text: '$1 <= any($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.lteAny` returns whether a value is less than or equal to any row of a *Table*.

```js
e.lteAny(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 <= any((select 5 union (select 7)))",
  args: [6] }
```

### Less Than or Equal All

* `lteAll: T => array => boolean`
* `lteAll: T => table => boolean`

Form 1. `.lteAll` returns whether a value is less than or equal to all members of an *Array*.

```js
e.lteAll(7, [4, 5, 9]).query

{ text: '$1 <= all($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.lteAll` returns whether a value is less than or equal to all rows of a *Table*.

```js
e.lteAll(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 <= all((select 5 union (select 7)))",
  args: [6] }
```

### Greater Than or Equal Any

* `gteAny: T => array => boolean`
* `gteAny: T => table => boolean`

Form 1. `.gteAny` returns whether a value is greater than or equal to any member of an *Array*.

```js
e.gteAny(7, [4, 5, 9]).query

{ text: '$1 >= any($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.gteAny` returns whether a value is greater than or equal to any row of a *Table*.

```js
e.gteAny(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 >= any((select 5 union (select 7)))",
  args: [6] }
```

### Greater Than or Equal All

* `gteAll: T => array => boolean`
* `gteAll: T => table => boolean`

Form 1. `.gteAll` returns whether a value is greater than or equal to all members of an *Array*.

```js
e.gteAll(7, [4, 5, 9]).query

{ text: '$1 >= all($2))',
  args: [7, [4, 5, 9]] }
```

Form 2. `.gteAll` returns whether a value is greater than or equal to all rows of a *Table*.

```js
e.gteAll(6, sq.sql`select 5 union (select 7)`).query

{ text: "$1 >= all((select 5 union (select 7)))",
  args: [6] }
```

## Math

### Add

* `add: number => number => number`

### Subtract

* `sub: number => number => number`

### Multiply

* `mul: number => number => number`

### Divide

* `div: number => number => number`

### Modulo

* `mod: number => number => number`

### Exponent

* `exp: number => number => number`

### Square Root

* `sqrt: number => number`

### Cube Root

* `cbrt: number => number`

### Factorial

* `fact: number => number`

## String

### Concatenation Operator

* `cat: string => string  => string`
* `cat: T => string  => string`
* `cat: string => T  => string`

See also [Concat Function](#concat-function), [Array Concatenation Operator](#concatenation-operator1) and [Array Cat](#array-cat)

### Concat Function

* `concat: string => ...string  => string`

### Like

* `like: string => string => escape`
* `like: string => string => .escape => string => boolean`

### Not Like

* `notLike: string => string => boolean`
* `notlike: string => string => .escape => string => boolean`

### Like Any

* `likeAny: T => array => boolean`
* `likeAny: T => table => boolean`

Form 1. `.likeAny` returns whether a string is like any member of a *String Array*.

```js
e.likeAny('cat', ['cat', 'dog', 'mouse']).query

{ text: '$1 like any($2))',
  args: ['cat', ['cat', 'dog', 'mouse']] }
```

Form 2. `.likeAny` returns whether a string is like any row of a *Table*.

```js
e.likeAny('cat', sq.sql`select 'cat' union (select 'dog')`).query

{ text: "$1 like any((select 'cat' union (select 'dog')))",
  args: ['cat'] }
```

### Like All

* `likeAll: T => array => boolean`
* `likeAll: T => table => boolean`

Form 1. `.likeAll` returns whether a string is like all members of a *String Array*.

```js
e.likeAll('cat', ['cat', 'dog', 'mouse']).query

{ text: '$1 like all($2))',
  args: ['cat', ['cat', 'dog', 'mouse']] }
```

Form 2. `.likeAll` returns whether a string is like all rows of a *Table*.

```js
e.likeAll('cat', sq.sql`select 'cat' union (select 'dog')`).query

{ text: "$1 like all((select 'cat' union (select 'dog')))",
  args: ['cat'] }
```

### Not Like Any

* `notLikeAny: T => array => boolean`
* `notLikeAny: T => table => boolean`

Form 1. `.notLikeAny` returns whether a string is *not* like any member of a *String Array*.

```js
e.notLikeAny('cat', ['cat', 'dog', 'mouse']).query

{ text: '$1 not like any($2))',
  args: ['cat', ['cat', 'dog', 'mouse']] }
```

Form 2. `.notLikeAny` returns whether a string is *not* like any row of a *Table*.

```js
e.notLikeAny('cat', sq.sql`select 'cat' union (select 'dog')`).query

{ text: "$1 not like any((select 'cat' union (select 'dog')))",
  args: ['cat'] }
```

### Not Like All

* `notLikeAll: T => array => boolean`
* `notLikeAll: T => table => boolean`

Form 1. `.notLikeAll` returns whether a string is *not* like all members of a *String Array*.

```js
e.notLikeAll('cat', ['cat', 'dog', 'mouse']).query

{ text: '$1 not like all($2))',
  args: ['cat', ['cat', 'dog', 'mouse']] }
```

Form 2. `.notLikeAll` returns whether a string is *not* like all rows of a *Table*.

```js
e.notLikeAll('cat', sq.sql`select 'cat' union (select 'dog')`).query

{ text: "$1 not like all((select 'cat' union (select 'dog')))",
  args: ['cat'] }
```

### Similar To

* `similarTo: string => string => boolean`

### Not Similar To

* `notSimilarTo: string => string => boolean`

### Lower

* `lower: string => string`

### Upper

* `upper: string => string`

## Date and Time

### Age

TODO

### Now

TODO

### Extract

TODO

## Range

## Aggregate

### Count

TODO

### Sum

TODO

### Average

TODO

### Min

TODO

### Max

TODO

### Standard Deviation

TODO

### Variance

TODO

## Conditional

TODO

### Case

TODO

### Coalesce

TODO

### Nullif

TODO

### Greatest

TODO

### Least

TODO

## Array

### Concatenation Operator

* `array => array => array`
* `array => T => array`
* `T => array => array`

STATUS: TODO

### Array Cat

* `concat: array => array  => array`

STATUS: TODO

### Array Get

* `array => number => unknown`

STATUS: TODO

### Array Append

* `array => array => unknown`

STATUS: TODO

### Unnest

**Reference** [Postgres](https://www.postgresql.org/docs/current/functions-array.html#ARRAY-FUNCTIONS-TABLE)

* `unnest: array => ...array => table`

`.unnest` builds a table from arrays. 

```js
e.unnest([1, 2, 3]).query
// equivalent to (select 1 union all select 2 union all select 3) as unnest(unnest)

{ text: 'unnest($1)',
  args: [[1, 2, 3]] }
```

`.unnest` accepts one or more arrays.

```js
e.unnest([1, 2, 3], ['cat', 'dog'], [true]).query

{ text: 'unnest($1, $2, $3)',
  args: [[1, 2, 3], ['cat', 'dog'], [true]] }
```

This table is generated:

unnest|unnest|unnest
--|-------|-----
1 | 'cat' | true
2 | 'dog' | null
3 | null  | null



## JSON

TODO

## Binary

### And

TODO

### Or

TODO

### Not

TODO

### Exclusive Or

TODO

### Shift Left

TODO

### Shift Right

TODO

## Table

### Union

TODO

### Union All

TODO

### Except

TODO

### Except All

TODO

### Intersect

TODO

### Intersect All

TODO
