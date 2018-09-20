const { sq, query } = require('../tape')

describe('tutorial', () => {
  describe('Manual Queries', () => {
    describe('SQL', () => {
      query({
        name: 'parameterized argument',
        query: sq.l`select * from person where age >= ${20} and age < ${30}`,
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
      query({
        name: 'chained calls',
        query: sq.l`select *`.l`from person`
          .l`where age >= ${20} and age < ${30}`,
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
      query({
        name: 'subquery argument',
        query: sq.l`select * from person ${sq.l`where age >= ${20} and age < ${30}`}`,
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
      query({
        name: 'function call',
        query: sq.l`select * from person where age >=`.l(20).l`and age <`.l(30),
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
    })
    describe('Raw', () => {
      query({
        name: '.l`$${arg}`',
        query: sq.l`select * from $${'test_table'}`,
        text: 'select * from test_table'
      })
      query({
        name: '.raw(arg)',
        query: sq.l`select * from`.raw('test_table').l`where id = ${7}`,
        text: 'select * from test_table where id = $1',
        args: [7]
      })
    })
    describe('Extend', () => {
      query({
        name: '.extend',
        query: sq.extend(
          sq.l`select *`,
          sq.l`from person`,
          sq.l`where age >= ${20} and age < ${30}`
        ),
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
    })
    describe('Link', () => {
      const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Dracula' }]
      const value = book => sq.l`(${book.id}, ${book.title})`
      const values = sq.extend(...books.map(value)).link`, `
      query({
        name: 'link',
        query: sq.l`insert into book(id, title)`.l`values ${values}`.link('\n'),
        text: 'insert into book(id, title)\nvalues ($1, $2), ($3, $4)',
        args: [1, '1984', 2, 'Dracula']
      })
    })
  })

  describe('Select Queries', () => {
    describe('From', () => {
      query({
        name: '.from``',
        query: sq.from`book`,
        text: 'select * from book'
      })
      query({
        name: ".from('', '')",
        query: sq.from('book', 'author'),
        text: 'select * from book, author'
      })
      query({
        name: '.from`join`',
        query: sq.from`book left join author on book.author_id = author.id`,
        text:
          'select * from book left join author on book.author_id = author.id'
      })
      query({
        name: '.from``.from``',
        query: sq.from`book`.from`person`,
        text: 'select * from book, person'
      })
      query({
        name: 'from object - string table source',
        query: sq.from({ b: 'book', p: 'person' }),
        text: 'select * from book as b, person as p'
      })
      query({
        name: 'from object - array of objects table source',
        query: sq.from({
          people: [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }]
        }),
        text: 'select * from (values ($1, $2), ($3, $4)) as people(age, name)',
        args: [7, 'Jo', 9, 'Mo']
      })
      query({
        name: 'from object - subquery table source',
        query: sq.from({ countDown: sq.l`unnest(${[3, 2, 1]})` }),
        text: 'select * from (unnest($1)) as count_down',
        args: [[3, 2, 1]]
      })
    })
    describe('Where', () => {
      query({
        name: '.where``',
        query: sq.from`book`.where`genre = ${'Fantasy'}`,
        text: 'select * from book where (genre = $1)',
        args: ['Fantasy']
      })
      query({
        name: '.where``.where``',
        query: sq.from`book`.where`genre = ${'Fantasy'}`.where`year = ${2000}`,
        text: 'select * from book where (genre = $1) and (year = $2)',
        args: ['Fantasy', 2000]
      })
      query({
        name: '.where``.where``',
        query: sq.from`person`.where`name = ${'Rob'}`.or`name = ${'Bob'}`
          .and`age = ${7}`,
        text:
          'select * from person where (name = $1) or (name = $2) and (age = $3)',
        args: ['Rob', 'Bob', 7]
      })
      query({
        name: '.where({})',
        query: sq.from`book`.where({ genre: 'Fantasy', year: 2000 }),
        text: 'select * from book where (genre = $1 and year = $2)',
        args: ['Fantasy', 2000]
      })
      query({
        name: '.where({ camelCase })',
        query: sq.from`person`.where({ firstName: 'Kaladin' }),
        text: 'select * from person where (first_name = $1)',
        args: ['Kaladin']
      })
      const condMinYear = sq.l`year >= ${20}`
      const condMaxYear = sq.l`year < ${30}`
      query({
        name: '.where({ Builder })',
        query: sq.from`person`.where({ condMinYear, condMaxYear }),
        text: 'select * from person where (year >= $1 and year < $2)',
        args: [20, 30]
      })
      query({
        name: '.where({}).where({})',
        query: sq.from`person`.where({ name: 'Rob' }, { name: 'Bob' }),
        text: 'select * from person where (name = $1 or name = $2)',
        args: ['Rob', 'Bob']
      })
    })
    describe('Select', () => {
      query({
        name: '.return``',
        query: sq.return`${1} as a, ${2} as b, ${1} + ${2} as sum`,
        text: 'select $1 as a, $2 as b, $3 + $4 as sum',
        args: [1, 2, 1, 2]
      })
      query({
        name: ".return('', '')",
        query: sq.from`book`.return('title', 'author'),
        text: 'select title, author from book'
      })
      query({
        name: '.return.return',
        query: sq.from`book`.return('title', 'author').return`id`,
        text: 'select title, author, id from book'
      })
      query({
        name: 'return object - string expression',
        query: sq.from`person`.return({
          firstName: 'person.first_name',
          age: 'person.age'
        }),
        text:
          'select person.first_name as first_name, person.age as age from person'
      })
      query({
        name: 'return object - subquery expression',
        query: sq.return({ sum: sq.l`${2} + ${3}` }),
        text: 'select ($1 + $2) as sum',
        args: [2, 3]
      })
    })
    describe('Join', () => {
      query({
        name: 'natural join',
        query: sq.from`book`.join`author`,
        text: 'select * from book natural join author',
        args: []
      })
      query({
        name: 'on',
        query: sq.from({ b: 'book' }).join({ a: 'author' })
          .on`b.author_id = a.id`,
        text:
          'select * from book as b join author as a on (b.author_id = a.id)',
        args: []
      })
      query({
        name: 'multiple on',
        query: sq.from({ b: 'book' }).join({ a: 'author' })
          .on`b.author_id = a.id`.on({ 'b.genre': 'Fantasy' }),
        text:
          'select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1)',
        args: ['Fantasy']
      })
      query({
        name: '.and / .or',
        query: sq.from({ b: 'book' }).join({ a: 'author' })
          .on`b.author_id = a.id`.and({ 'b.genre': 'Fantasy' })
          .or`b.special = true`,
        text:
          'select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)',
        args: ['Fantasy']
      })
      query({
        name: 'using',
        query: sq.from`book`.join`author`.using`author_id`,
        text: 'select * from book join author using (author_id)',
        args: []
      })
      query({
        name: 'multiple using',
        query: sq.from`a`.join`b`.using('x', 'y').using`z`,
        text: 'select * from a join b using (x, y, z)',
        args: []
      })
      query({
        name: 'join type',
        query: sq.from`book`.left.join`author`.right.join`publisher`,
        text:
          'select * from book natural left join author natural right join publisher',
        args: []
      })
      query({
        name: 'multiple join type',
        query: sq.from`book`.left.right.join`author`.cross.inner
          .join`publisher`,
        text:
          'select * from book natural right join author natural join publisher',
        args: []
      })
    })
    test('Express Syntax', () => {
      const name = 'Dalinar'
      // a == b and b ==c --> a == c
      const a = sq`person`
      const b = sq('person')
      const c = sq.from`person`
      expect(a.query).toEqual(b.query)
      expect(b.query).toEqual(c.query)

      const d = sq`person``name = ${name}`
      const e = sq`person`({ name })
      const f = sq.from`person`.where`name = ${name}`
      expect(d.query).toEqual(e.query)
      expect(e.query).toEqual(f.query)

      const g = sq`person``name = ${name}``age`
      const h = sq.from`person`.where`name = ${name}`.return`age`
      const i = sq
        .from('person')
        .where({ name })
        .return('age')
      expect(g.query).toEqual(h.query)
      expect(h.query).toEqual(i.query)
    })
  })

  describe('Manipulation Queries', () => {
    describe('Delete', () => {
      expect(sq.from`person`.delete.query).toEqual(sq.delete.from`person`.query)
      query({
        name: '.delete',
        query: sq.from`person`.delete,
        text: 'delete from person'
      })
      query({
        name: '.where.delete',
        query: sq.from`person`.where`id = ${723}`.delete,
        text: 'delete from person where (id = $1)',
        args: [723]
      })
      query({
        name: '.return.delete',
        query: sq.from`person`.return`name`.delete,
        text: 'delete from person returning name'
      })
      query({
        name: 'express.delete',
        query: sq`person`({ job: 'student' })`name`.delete,
        text: 'delete from person where (job = $1) returning name',
        args: ['student']
      })
      query({
        name: '.delete.delete',
        query: sq`book`.delete.delete.delete,
        text: 'delete from book'
      })
      query({
        name: 'delete using',
        query: sq.delete.from`book`.from`author`
          .where`book.author_id = author.id and author.contract = 'terminated'`,
        text:
          "delete from book using author where (book.author_id = author.id and author.contract = 'terminated')"
      })
    })
    describe('Insert', () => {
      query({
        name: '.insert``',
        query: sq.from`person`.insert`first_name, last_name`
          .value`${'Shallan'}, ${'Davar'}`.value`${'Navani'}, ${'Kholin'}`,
        text:
          'insert into person (first_name, last_name) values ($1, $2), ($3, $4)',
        args: ['Shallan', 'Davar', 'Navani', 'Kholin']
      })
      query({
        name: ".insert('', '').value(1, '').value(1, '')",
        query: sq.from`book`
          .insert('title', 'year')
          .value('The Way of Kings', 2010)
          .value('Words of Radiance', null)
          .value('Oathbringer'),
        text:
          'insert into book (title, year) values ($1, $2), ($3, $4), ($5, default)',
        args: [
          'The Way of Kings',
          2010,
          'Words of Radiance',
          null,
          'Oathbringer'
        ]
      })
      query({
        name: '.insert({}).insert({}).insert({})',
        query: sq.from`book`
          .insert({ title: 'The Way of Kings', year: 2010 })
          .insert({ title: 'Words of Radiance', year: null })
          .insert({ title: 'Oathbringer' }),
        text:
          'insert into book (title, year) values ($1, $2), ($3, $4), ($5, default)',
        args: [
          'The Way of Kings',
          2010,
          'Words of Radiance',
          null,
          'Oathbringer'
        ]
      })
      query({
        name: '',
        query: sq.from`book`.insert({ title: 'Squirrels and Acorns' })
          .return`id`,
        text: 'insert into book (title) values ($1) returning id',
        args: ['Squirrels and Acorns']
      })
    })
    describe('Update', () => {
      query({
        name: '.set``',
        query: sq.from`person`.set`age = age + 1, processed = true`
          .set`name = ${'Sally'}`,
        text: 'update person set age = age + 1, processed = true, name = $1',
        args: ['Sally']
      })
      query({
        name: '.set({})',
        query: sq.from`person`
          .where({ firstName: 'Matt' })
          .set({ firstName: 'Robert', nickname: 'Rob' }),
        text:
          'update person set first_name = $1, nickname = $2 where (first_name = $3)',
        args: ['Robert', 'Rob', 'Matt']
      })
      query({
        name: 'express.set({})',
        query: sq`person`({ firstName: 'Rob' })`id`.set({
          firstName: 'Robert'
        }),
        text:
          'update person set first_name = $1 where (first_name = $2) returning id',
        args: ['Robert', 'Rob']
      })
      query({
        name: '.set({}).set({})',
        query: sq.from`person`
          .where({ firstName: 'Matt' })
          .set({ firstName: 'Robert' })
          .set({ nickname: 'Rob' }),
        text:
          'update person set first_name = $1, nickname = $2 where (first_name = $3)',
        args: ['Robert', 'Rob', 'Matt']
      })
      query({
        name: 'insert, from',
        query: sq.from`book`.from`author`.set({ available: false })
          .where`book.author_id = author.id and author.contract = 'terminated'`,
        text:
          "update book set available = $1 from author where (book.author_id = author.id and author.contract = 'terminated')",
        args: [false]
      })
    })
  })
})
