const { sq, query } = require('../tape')

describe('tutorial', () => {
  describe('Manual Queries', () => {
    test('all', () => {
      expect(
        sq.l`select * from person where age >= ${20} and age < ${30}`.qry
      ).toEqual({
        txt: 'select * from person where age >= $1 and age < $2',
        arg: [20, 30]
      })

      expect(sq.l`select * from $${'test_table'}`.qry).toEqual({
        txt: 'select * from test_table',
        arg: []
      })
    })
  })

  describe('Select Queries', () => {
    test('From', () => {
      expect(sq.frm`book`.qry).toEqual({
        txt: 'select * from book',
        arg: []
      })
      expect(sq.frm('book', 'author').qry).toEqual({
        txt: 'select * from book, author',
        arg: []
      })
      expect(
        sq.frm`book left join author on book.author_id = author.id`.qry
      ).toEqual({
        txt:
          'select * from book left join author on book.author_id = author.id',
        arg: []
      })
      expect(sq.frm`book`.frm`person`.qry).toEqual({
        txt: 'select * from person',
        arg: []
      })
    })
    test('Where', () => {
      expect(sq.frm`book`.whr`genre = ${'Fantasy'}`.qry).toEqual({
        txt: 'select * from book where genre = $1',
        arg: ['Fantasy']
      })
      expect(
        sq.frm`book`.whr`genre = ${'Fantasy'}`.whr`year = ${2000}`.qry
      ).toEqual({
        txt: 'select * from book where genre = $1 and year = $2',
        arg: ['Fantasy', 2000]
      })
      expect(sq.frm`book`.whr({ genre: 'Fantasy', year: 2000 }).qry).toEqual({
        txt: 'select * from book where genre = $1 and year = $2',
        arg: ['Fantasy', 2000]
      })
      expect(sq.frm`person`.whr({ firstName: 'Kaladin' }).qry).toEqual({
        txt: 'select * from person where first_name = $1',
        arg: ['Kaladin']
      })
      const condMinYear = sq.l`year >= ${20}`
      const condMaxYear = sq.l`year < ${30}`
      expect(sq.frm`person`.whr({ condMinYear, condMaxYear }).qry).toEqual({
        txt: 'select * from person where year >= $1 and year < $2',
        arg: [20, 30]
      })
      expect(sq.frm`person`.whr({ name: 'Rob' }, { name: 'Bob' }).qry).toEqual({
        txt: 'select * from person where name = $1 or name = $2',
        arg: ['Rob', 'Bob']
      })
    })
    test('Returning', () => {
      expect(sq.frm`book`.ret`title, author`.qry).toEqual({
        txt: 'select title, author from book',
        arg: []
      })
      expect(sq.frm`book`.ret('title', 'author').qry).toEqual({
        txt: 'select title, author from book',
        arg: []
      })
      expect(sq.frm`book`.ret('title', 'author').ret`id`.qry).toEqual({
        txt: 'select title, author, id from book',
        arg: []
      })
    })
    test('Express Syntax', () => {
      const name = 'Dalinar'
      // a == b and b ==c --> a == c
      const a = sq`person`.qry
      const b = sq('person').qry
      const c = sq.frm`person`.qry
      expect(a).toEqual(b)
      expect(b).toEqual(c)
      const d = sq`person``name = ${name}`.qry
      const e = sq`person`({ name }).qry
      const f = sq.frm`person`.whr`name = ${name}`.qry
      expect(d).toEqual(e)
      expect(e).toEqual(f)
      const g = sq`person``name = ${name}``age`.qry
      const h = sq.frm`person`.whr`name = ${name}`.ret`age`.qry
      const i = sq
        .frm('person')
        .whr({ name })
        .ret('age').qry
      expect(g).toEqual(h)
      expect(h).toEqual(i)
    })
  })

  describe('Manipulation Queries', () => {
    test('Delete', () => {
      expect(sq.frm`person`.del.qry).toEqual(sq.del.frm`person`.qry)
      expect(sq.frm`person`.del.qry).toEqual({
        txt: 'delete from person',
        arg: []
      })
      expect(sq.frm`person`.whr`id = ${723}`.del.qry).toEqual({
        txt: 'delete from person where id = $1',
        arg: [723]
      })
      expect(sq.frm`person`.ret`name`.del.qry).toEqual({
        txt: 'delete from person returning name',
        arg: []
      })
      expect(sq`person`({ job: 'student' })`name`.del.qry).toEqual({
        txt: 'delete from person where job = $1 returning name',
        arg: ['student']
      })
      expect(sq`book`.del.del.del.qry).toEqual({
        txt: 'delete from book',
        arg: []
      })
    })
    test('Insert', () => {
      expect(
        sq.frm`person`.ins`first_name, last_name`.val`${'Shallan'}, ${'Davar'}`
          .val`${'Navani'}, ${'Kholin'}`.qry
      ).toEqual({
        txt:
          'insert into person (first_name, last_name) values ($1, $2), ($3, $4)',
        arg: ['Shallan', 'Davar', 'Navani', 'Kholin']
      })
      expect(
        sq.frm`book`
          .ins('title', 'year')
          .val('The Way of Kings', years[0])
          .val('Words of Radiance', null)
          .val('Oathbringer').qry
      ).toEqual({
        txt:
          'insert into book (title, year) values ($1, $2), ($3, NULL), ($4, DEFAULT)',
        arg: ['The Way of Kings', 2010, 'Words of Radiance', 'Oathbringer']
      })
      expect(
        sq.frm`book`
          .ins({ title: 'The Way of Kings', year: 2010 })
          .ins({ title: 'Words of Radiance', year: null })
          .ins({ title: 'Oathbringer' }).qry
      ).toEqual({
        txt:
          'insert into book (title, year) values ($1, $2), ($3, NULL), ($4, DEFAULT)',
        arg: ['The Way of Kings', 2010, 'Words of Radiance', 'Oathbringer']
      })
      expect(
        sq.frm`book`.ins({ title: 'Squirrels and Acorns' }).ret`id`.qry
      ).toEqual(sq`book`()`id`.ins({ title: 'Squirrels and Acorns' }).qry)
      expect(
        sq.frm`book`.ins({ title: 'Squirrels and Acorns' }).ret`id`.qry
      ).toEqual({
        txt: 'insert into book (title) values ($1) returning id',
        arg: ['Squirrels and Acorns']
      })
      expect().toEqual()
      expect().toEqual()
    })
    test('Update', () => {
      expect(
        sq.frm`person`.upd`age = age + 1, processed = true`
          .upd`name = ${'Sally'}`.qry
      ).toEqual({
        txt: 'update person set age = age + 1, processed = true, name = $1',
        arg: ['Sally']
      })
      expect(
        sq.frm`person`
          .whr({ firstName: 'Rob' })
          .upd({ firstName: 'Robert', nickname: 'Rob' }).qry
      ).toEqual({
        txt:
          'update person where first_name = $1 set first_name = $1, nickname = $3',
        arg: ['Rob', 'Robert', 'Rob']
      })
      expect(
        sq`person`({ firstName: 'Rob' })`id`.upd({ firstName: 'Robert' }).qry
      ).toEqual({
        txt:
          'update person where first_name = $1 set first_name = $2 returning id',
        arg: ['Rob', 'Robert']
      })
      expect(
        sq.frm`person`
          .whr({ firstName: 'Rob' })
          .upd({ firstName: 'Robert' })
          .upd({ nickname: 'Rob' }).qry
      ).toEqual({
        txt:
          'update person where first_name = $1 set first_name = $1, nickname = $3',
        arg: ['Rob', 'Robert', 'Rob']
      })
      expect().toEqual()
      expect().toEqual()
    })
  })
})
