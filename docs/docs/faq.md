---
id: faq
title: FAQ
sidebar_label: FAQ
---

## How does Sqorn prevent SQL injection?

Sqorn's query builder constructs __parameterized queries__, which are then passed to the underlying database library for execution.

```javascript
const name = 'Bruce Wayne'
const city = 'Gotham City'
const query = sq.frm`person`.whr`name = ${name} and city = ${city}`.qry()
const expected = {
  txt: 'select * from person where name = $1 and city = $2',
  arg: ['Bruce Wayne', 'Gotham City']
}
expect(query).toEqual(expected)
```

## How does Sqorn work?

When a method on the query builder `sq` is called, it pushes an object containing the method name and arguments to an array named `methods`.

```javascript
sq.frm`person`.whr`age > ${20} and age < ${30}`.ret`name`
// methods ===
[ { type: 'frm', args: [ [ 'person' ] ] },
  { type: 'whr', args: [ [ 'age > ', ' and age < ', '' ], 20, 30 ] },
  { type: 'ret', args: [ [ 'name' ] ] } ]
```

Certain methods like `.run` trigger the three-step compilation process:

First, the entries in `methods` are processed sequentially to build a context object `ctx`.

```javascript
// ctx === context(methods) ===
{ type: 'select',
  frm: [ [ 'person' ] ],
  whr: [ [ 'age > ', ' and age < ', '' ], 20, 30 ],
  ret: [ [ 'name' ] ] }
```

Second, a `Query` of type `ctx.type` is constructed. Each `Query` is constructed from a sequence of `clauses`, which are evaluated against `ctx`. Each clause returns an object with properties `txt` for its text component and `arg` for its parameterized arguments.

```javascript
select = Query(
  With,   // undefined
  Select, // { txt: 'select age', arg: [] }
  From,   // { txt: 'from person', arg: []}
  Where,  // { txt: 'where age > $1 and age < $2, arg: [7, 13] }
  Group,  // undefined
  Having, // undefined
  Order,  // undefined
  Limit,  // undefined
  Offset  // undefined
)
```

Finally, the contributions from all clauses are joined together to construct a complete SQL query with parameterized arguments. This query is passed to the underlying database library for execution.

```javascript
{ txt: 'select age from person where age > $1 and age < $2' 
  arg: [7, 13] }
```

## Is Sqorn production ready?

Not yet. It still needs:

* Comprehensive tests
* Benchmarks
* A track record
* Active users

Join us on [Github](https://github.com/eejdoowad/sqorn)
