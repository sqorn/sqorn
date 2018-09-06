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
const query = sq.from`person`.where`name = ${name} and city = ${city}`.query()
const expected = {
  txt: 'select * from person where name = $1 and city = $2',
  arg: ['Bruce Wayne', 'Gotham City']
}
expect(query).toEqual(expected)
```

## How does Sqorn work?

When a method on the query builder `sq` is called, it pushes an object containing the method name and arguments to an array named `methods`.

```javascript
sq.from`person`.where`age > ${20} and age < ${30}`.return`name`
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

## Are there Complex Example Queries?

This section is still a work in progress

```js

getUser()

const Post = sq.from`post`
const WhereUser = user => user && sq.where({ user })
const WhereTopic = topic => topic && sq.where({ topic })
const getTimeRange = time => {
    switch (time) {
      case 'day': return '1 day'
      case 'week': return '7 days'
      case 'month': return '30 days'
      case 'year': return '365 days'
  }
}
const WhereTime = time => {
  const timeRange = getTimeRange(time)
  return timeRange && sq.where`create_time >= now() - $${timeRange}`
}
const OrderBy = sq.order`score asc`
const Limit = limit => limit && sq.limit(limit)
const Return = sq.return`id, title, topic, user`

const getTopPosts = ({ time, topic, user, limit = 25 }) => sq.extend(
  Post,
  WhereUser(user),
  WhereTopic(topic),
  WhereTime(time),
  OrderBy,
  Limit(limit),
  Return
)

const getTopPosts2 = ({ time, topic, user, limit = 25 }) => {
  const mq = sq.mut.from`post`
  if (user) {
    mq.where({ user })
  }
  if (topic) {
    mq.where({ topic })
  }
  let range
  if (time === 'day') {
    range = '1 day'
  } else if (time === 'week') {
    range = '7 days'
  } else if (time === 'month') {
    range = '30 days'
  } else if (time === 'year') {
    range = '365 days'
  }
  if (range) {
    mq.where`create_time >= now() - ${range}`
  }
  mq.order`score asc`
  mq.limit(limit)
  mq.return`id, title, topic, user`
  return mq.imm
}

const minAge = age => sq.where`age >= ${age}`
const language = language => sq.where({ language })
const productionTable = production => sq.from(production ? 'book' : 'book_test')
const columns = sq.return`title, author`

const sq.extend(
  productionTable(true),
  columns
  minAge(8),
  language('English')
)



const Person = sq.from`person`
const Gender = gender => sq.where`gender = ${gender}`
const isChild = sq.where`age < 13`
const Name = name => sq.where`name = ${name}`

const Child = sq.extend(Person, isChild)
const Girl = sq.extend(Kid, Gender('female'))
const Boy = sq.extend(Kid, Gender('male'))

const Movie = sq.from`movie`
const Genre = genre => sq.where`genre = ${genre}`
const Animation = sq.extend(Movie, Genre('animation'))

const kids = sq.from`person`.where`age < ${age}`
const boys = kids.where`gender = ${gender}`
```