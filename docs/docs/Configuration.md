---
id: configuration
title: Configuration
sidebar_label: Configuration
---

[`thenable`](#thenable) [`mapInputKeys`](#map-input-keys) [`mapOutputKeys`](#map-output-keys)

### Thenable

By default, Sqorn's query builder `sq` is *thenable*. This allows you to directly `await` or call `.then` on `sq`.

Disable this behavior by setting `thenable` to `false`.

```js
const sq = sqorn({ thenable: false })

// throws error
const people = await sq.sql`select * from person`
sq.sql`select * from person`.then(people => {})

// succeeds
const people = await sq.sql`select * from person`.all()
sq.sql`select * from person`.all().then(people => {})
```

### Map Input Keys

By default, Sqorn converts input object keys to *snake_case*.

```js
sq.with({ aB: sq.sql`select cD`, e_f: sq.sql`select g_h` })
  .from({ iJ3: 'kL', mN: [{ oP: 1, q_r: 1 }] })
  .where({ sT: 1, u_v: 1 })
  .return({ wX: 1, y_z: 1 })
  .link('\n').query.text

`with a_b (select cD), e_f (select g_h)
select $1 w_x, $2 y_z
from kL i_j3, (values ($3, $4)) m_n(o_p, q_r)
where (s_t = $5 and u_v = $6)`
```

String arguments, template string arguments, and object values are not converted. By default, object keys containing parentheses are returned unmodified.

```js
sq.with({ 'aB(cD, e_f)': sq.sql`select 1, 2`})
  .from('gH')
  .from`jK`
  .return({ lM: 'nO' }, 'pQ')
  .query

{ text: 'with aB(cD, e_f) (select 1, 2) select nO l_m, pQ from gH, jK',
  args: [] }
```

Customize how input object keys are mapped by setting `mapInputKeys` to a function that takes a key and returns its mapping.

```js
const sq = sqorn({ mapInputKeys: key => key.toUpperCase() })

sq.return({ favoriteNumber: 8 }).query

{ text: 'select $1 FAVORITENUMBER',
  args: [8] }
```

Mappings are computed once per key then cached.

### Map Output Keys

By default, Sqorn converts output object keys to *camelCase*.

```js
const [first] = await sq.from`person`.return`id, first_name, last_name`.limit`1`
const { id, firstName, lastName } = first
```

Customize how output object keys are mapped by setting `mapOutputKeys` to a function that takes a key and returns its mapping.

```js
const sq = sqorn({ mapOutputKeys: key => key.toUpperCase() })

const [first] = await sq.from`person`.return`id, first_name, last_name`.limit`1`
const { ID, FIRST_NAME, LAST_NAME } = first
```

Mappings are computed once per key then cached.
