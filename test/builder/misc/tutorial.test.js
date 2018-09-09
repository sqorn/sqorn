const { sq, query } = require('../tape')

describe('tutorial', () => {
  describe('Manual Queries', () => {
    query({
      name: 'parameterized argument',
      query: sq.l`select * from person where age >= ${20} and age < ${30}`,
      text: 'select * from person where age >= $1 and age < $2',
      args: [20, 30]
    })
    query({
      name: 'raw argument',
      query: sq.l`select * from $${'test_table'}`,
      text: 'select * from test_table'
    })
    query({
      name: 'string argument',
      query: sq.l('select * from person where age >= 20 and age < 30'),
      text: 'select * from person where age >= 20 and age < 30'
    })
    query({
      name: 'multiple calls',
      query: sq.l`select * from person`.l`where age >= ${20}`
        .l`and age < ${30}`,
      text: 'select * from person where age >= $1 and age < $2',
      args: [20, 30]
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
    describe('Returning', () => {
      query({
        name: '.return``',
        query: sq.from`book`.return`title, author`,
        text: 'select title, author from book'
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
    })
  })
})
