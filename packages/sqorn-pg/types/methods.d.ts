export interface Set {
  /**
   * **SET clause** - update values
   *
   * Pass `.set` the values to update.
   * 
   * Multiple `.set` calls are joined with ', '.
   * 
   * @example
```js
sq.from('person')
  .set({ age: sq.txt`age + 1`, done: true })
  .where({ age: 7 })
  .return('person.name')
// update person
// set age = age + 1, done = true
// where age = 7
// returning person.name

sq.from('person').set(
  { firstName: 'Robert', nickname: 'Rob' },
  { processed: true }
)
// update person
// set first_name = 'Robert', nickname = 'Rob', processed = true

sq.from('person')
  .set({ firstName: sq.txt`'Bob'` })
  .set({ lastName: sq.return`'Smith'` })
// update person
// set first_name = 'Bob', last_name = (select 'Smith')
```
   */
  set(...values: Value[]): this

  /**
   * **SET clause** - template string
   *
   * Pass `.set` the values to update.
   * 
   * Multiple `.set` calls are joined with ', '.
   * 
   * @example
```js
sq.from`person`
  .set`age = age + 1, processed = true`
// update person
// set age = age + 1, processed = true

sq.from`person`
  .set`age = age + 1, processed = true`
  .set`name = ${'Sally'}`
// update person
// set age = age + 1, processed = true, name = 'Sally'
```
   */
  set(strings: TemplateStringsArray, ...args: Arg[]): this
}


export interface Delete {
  /**
   * DELETE - marks the query as a delete query
   *
   * @example
```js
sq.delete.from`person`
// delete * from person

sq.delete.from`person`.where`age < 7`.return`id`
// delete from person where age < 7 returning id

sq.from`person``age < 7``id`.delete
// delete from person where age < 7 returning id
```
   */
  readonly delete: this
}


export interface Manual {
  /**
   * Manually Build Query
   *
   * Multiple calls to `.sql` are joined with spaces.
   *
   * Template string arguments are automatically parameterized.
   * To provide a raw unparameterized argument, prefix it with `$`.
   * Arguments can be subQ.
   *
   * @example
```js
sq.sql`select * from book`
// select * from book

sq.sql`select * from person`.sql`where age = ${8}`.sql`or name = ${'Jo'}`
// select * from person where age = $1 or name = $2

sq.sql`select * ${sq.raw('person')}`
// select * from person

sq.from`person`.where({ min: sq.txt`age < 7` })
// select * from person where age < 7

sq.return`now() today, (${sq.return`now() + '1 day'`}) tomorrow`
// select now() today, (select now() + '1 day') tomorrow
```
   */
  sql(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Parameterizes Query argument(s)
   *
   * Multiple calls to `.sql` are joined with spaces.
   *
   * @example
```js
sq.sql`select * from person where age >=`.sql(20).sql`and age < `.sql(30)
// select * from person where age >= $1 and age < $2

sq.return({ safe: sq.txt('Jo'), dangerous: 'Mo' })
// select $1 as safe, Mo as dangerous
```
   */
  sql(...args: any): this

  /**
   * Manually Build Text Fragment
   *
   * Multiple calls to `.txt` are joined with spaces.
   *
   * Template string arguments are automatically parameterized.
   * To provide a raw unparameterized argument, prefix it with `$`.
   * Arguments can be subQ.
   *
   * @example
```js
   */
  txt(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Parameterizes Fragment argument(s)
   *
   * Multiple calls to `.txt` are joined with spaces.
   *
   * @example
```js

```
   */
  txt(...args: any): this

}


export interface Raw {
  /**
   * Creates a string that is not parameterized when embedded.
   *
   * Alternatively prefix an argument with `$` in a tagged template literal.
   *
   * @example
```js
sq.sql`select * from`.raw('test_table').sql`where id = ${7}`
// select * from test_table where id = $1

sq.sql`select * from ${sq.raw('test_table')} where id = ${7}`
// select * from test_table where id = $1
```
   */
  raw(string: string): Buildable
}

export interface Link {
  /**
   * Specifies the separator used to join components of a manual query
   * or clauses of a non-manual query.
   * 
   * @example
```js
const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Hi' }]
const val = book => sq.sql`(${book.id}, ${book.title})`
const values = sq.extend(...books.map(val)).link(', ')
// ($1, $2), ($3, $4)

sq.sql`insert into book(id, title)`.sql`values ${values}`.link('\n')
// insert into book(id, title)
// values ($1, $2), ($3, $4)'
```
   */
  link(separator: string): this
}

export interface Buildable {
  /**
   * Compiles the query builder state to return the equivalent parameterized query
   *
   * @example
```js
sq.sql`select * from book`.query
{ text: 'select * from book', args: [], type: 'manual' }

sq.from`book`({ id: 7 })`title`.query
{ text: 'select title from book where id = $1', args: [7], type: 'select' }

sq.from`book`.delete({ id: 7 })`title`.query
{ text: 'delete from book where id = $1 returning title', args: [7], type: 'delete' }
```
   */
  readonly query: { text: string; args: any[], type: 'manual' | 'select' | 'update' | 'delete' | 'insert' | 'values' };

  /**
   * **DANGER. DO NOT USE THIS METHOD. IT MAKES YOU VULNERABLE TO SQL INJECTION.**
   * 
   * Compiles the query builder state to return the equivalent unparameterized query.
   * 
   * Always use `.query` if possible. This method is dangerous and unreliable.
   *
   * @example
```js
sq.from`book`({ id: 7 })`title`.unparameterized ===
'select title from book where id = 7'
```
   */
  readonly unparameterized: string
}

interface Extend {
  /**
   * Returns a new query equivalent to the combination of the current
   * query and the argument queries
   * 
   * @example
```js
sq.extend(sq.from('book').where({ id: 8 }), sq.return('title'))
// select title from book where (id = 8)

sq.from('book').extend(sq.where({ genre: 'Fantasy'})).return('id')
// select id from book where genre = $1

sq.sql`select id`.extend(sq.sql`from book`, sq.sql`where genre = ${'Fantasy'}`)
// select id from book where genre = $1

sq.from`author`.extend(
  sq.from`book``book.author_id = author.id``title`,
  sq.from`publisher``publisher.id = book.publisher_id``publisher`
)`author.id = 7``first_name`
// select title, publisher, first_name
// from author, book, publisher
// where (book.author_id = author.id)
// and (publisher.id = book.publisher_id)
// and (author.id = 7)
```
   * 
   */
  extend(...sq: SQ[]): this
}
