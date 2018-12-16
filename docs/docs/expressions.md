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

* Multidimensional types like Array Expression, Row Expression and Table Expression lose all information about their constituent types. Sqorn won't warn you if you build the expression `e.eq(e(true, false), e(3, 4))`.

Note that in Typescript, types exist at compile time, not run time.

Sqorns expression types are listed below:

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
