const { sq, query } = require('../tape')

describe('tutorial', () => {
  describe('Manual Queries', () => {
    query({
      name: 'manual query parameterized argument',
      qry: sq.l`select * from person where age >= ${20} and age < ${30}`,
      txt: 'select * from person where age >= $1 and age < $2',
      arg: [20, 30]
    })
    query({
      name: 'manual query raw argument',
      qry: sq.l`select * from $${'test_table'}`,
      txt: 'select * from test_table'
    })
  })

  describe('Select Queries', () => {
    describe('From', () => {
      query({
        name: '.frm``',
        qry: sq.frm`book`,
        txt: 'select * from book'
      })
      query({
        name: ".frm('', '')",
        qry: sq.frm('book', 'author'),
        txt: 'select * from book, author'
      })
      query({
        name: '.frm`join`',
        qry: sq.frm`book left join author on book.author_id = author.id`,
        txt: 'select * from book left join author on book.author_id = author.id'
      })
      query({
        name: '.frm``.frm``',
        qry: sq.frm`book`.frm`person`,
        txt: 'select * from person'
      })
    })
    describe('Where', () => {
      query({
        name: '.whr``',
        qry: sq.frm`book`.whr`genre = ${'Fantasy'}`,
        txt: 'select * from book where genre = $1',
        arg: ['Fantasy']
      })
      query({
        name: '.whr``.whr``',
        qry: sq.frm`book`.whr`genre = ${'Fantasy'}`.whr`year = ${2000}`,
        txt: 'select * from book where genre = $1 and year = $2',
        arg: ['Fantasy', 2000]
      })
      query({
        name: '.whr({})',
        qry: sq.frm`book`.whr({ genre: 'Fantasy', year: 2000 }),
        txt: 'select * from book where genre = $1 and year = $2',
        arg: ['Fantasy', 2000]
      })
      query({
        name: '.whr({ camelCase })',
        qry: sq.frm`person`.whr({ firstName: 'Kaladin' }),
        txt: 'select * from person where first_name = $1',
        arg: ['Kaladin']
      })
      const condMinYear = sq.l`year >= ${20}`
      const condMaxYear = sq.l`year < ${30}`
      query({
        name: '.whr({ Builder })',
        qry: sq.frm`person`.whr({ condMinYear, condMaxYear }),
        txt: 'select * from person where year >= $1 and year < $2',
        arg: [20, 30]
      })
      query({
        name: '.whr({}).whr({})',
        qry: sq.frm`person`.whr({ name: 'Rob' }, { name: 'Bob' }),
        txt: 'select * from person where name = $1 or name = $2',
        arg: ['Rob', 'Bob']
      })
    })
    describe('Returning', () => {
      query({
        name: '.ret``',
        qry: sq.frm`book`.ret`title, author`,
        txt: 'select title, author from book'
      })
      query({
        name: ".ret('', '')",
        qry: sq.frm`book`.ret('title', 'author'),
        txt: 'select title, author from book'
      })
      query({
        name: '.ret.ret',
        qry: sq.frm`book`.ret('title', 'author').ret`id`,
        txt: 'select id from book'
      })
    })
    test('Express Syntax', () => {
      const name = 'Dalinar'
      // a == b and b ==c --> a == c
      const a = sq`person`
      const b = sq('person')
      const c = sq.frm`person`
      expect(a.qry).toEqual(b.qry)
      expect(b.qry).toEqual(c.qry)

      const d = sq`person``name = ${name}`
      const e = sq`person`({ name })
      const f = sq.frm`person`.whr`name = ${name}`
      expect(d.qry).toEqual(e.qry)
      expect(e.qry).toEqual(f.qry)

      const g = sq`person``name = ${name}``age`
      const h = sq.frm`person`.whr`name = ${name}`.ret`age`
      const i = sq
        .frm('person')
        .whr({ name })
        .ret('age')
      expect(g.qry).toEqual(h.qry)
      expect(h.qry).toEqual(i.qry)
    })
  })

  describe('Manipulation Queries', () => {
    describe('Delete', () => {
      expect(sq.frm`person`.del.qry).toEqual(sq.del.frm`person`.qry)
      query({
        name: '.del',
        qry: sq.frm`person`.del,
        txt: 'delete from person'
      })
      query({
        name: '.whr.del',
        qry: sq.frm`person`.whr`id = ${723}`.del,
        txt: 'delete from person where id = $1',
        arg: [723]
      })
      query({
        name: '.ret.del',
        qry: sq.frm`person`.ret`name`.del,
        txt: 'delete from person returning name'
      })
      query({
        name: 'express.del',
        qry: sq`person`({ job: 'student' })`name`.del,
        txt: 'delete from person where job = $1 returning name',
        arg: ['student']
      })
      query({
        name: '.del.del',
        qry: sq`book`.del.del.del,
        txt: 'delete from book'
      })
    })
    describe('Insert', () => {
      query({
        name: '.ins``',
        qry: sq.frm`person`.ins`first_name, last_name`
          .val`${'Shallan'}, ${'Davar'}`.val`${'Navani'}, ${'Kholin'}`,
        txt:
          'insert into person (first_name, last_name) values ($1, $2), ($3, $4)',
        arg: ['Shallan', 'Davar', 'Navani', 'Kholin']
      })
      query({
        name: ".ins('', '').val(1, '').val(1, '')",
        qry: sq.frm`book`
          .ins('title', 'year')
          .val('The Way of Kings', 2010)
          .val('Words of Radiance', null)
          .val('Oathbringer'),
        txt:
          'insert into book (title, year) values ($1, $2), ($3, $4), ($5, default)',
        arg: [
          'The Way of Kings',
          2010,
          'Words of Radiance',
          null,
          'Oathbringer'
        ]
      })
      query({
        name: '.ins({}).ins({}).ins({})',
        qry: sq.frm`book`
          .ins({ title: 'The Way of Kings', year: 2010 })
          .ins({ title: 'Words of Radiance', year: null })
          .ins({ title: 'Oathbringer' }),
        txt:
          'insert into book (title, year) values ($1, $2), ($3, $4), ($5, default)',
        arg: [
          'The Way of Kings',
          2010,
          'Words of Radiance',
          null,
          'Oathbringer'
        ]
      })
      query({
        name: '',
        qry: sq.frm`book`.ins({ title: 'Squirrels and Acorns' }).ret`id`,
        txt: 'insert into book (title) values ($1) returning id',
        arg: ['Squirrels and Acorns']
      })
    })
    describe('Update', () => {
      query({
        name: '.upd``',
        qry: sq.frm`person`.upd`age = age + 1, processed = true`
          .upd`name = ${'Sally'}`,
        txt: 'update person set age = age + 1, processed = true, name = $1',
        arg: ['Sally']
      })
      query({
        name: '.upd({})',
        qry: sq.frm`person`
          .whr({ firstName: 'Matt' })
          .upd({ firstName: 'Robert', nickname: 'Rob' }),
        txt:
          'update person set first_name = $1, nickname = $2 where first_name = $3',
        arg: ['Robert', 'Rob', 'Matt']
      })
      query({
        name: 'express.upd({})',
        qry: sq`person`({ firstName: 'Rob' })`id`.upd({ firstName: 'Robert' }),
        txt:
          'update person set first_name = $1 where first_name = $2 returning id',
        arg: ['Robert', 'Rob']
      })
      query({
        name: '.upd({}).upd({})',
        qry: sq.frm`person`
          .whr({ firstName: 'Matt' })
          .upd({ firstName: 'Robert' })
          .upd({ nickname: 'Rob' }),
        txt:
          'update person set first_name = $1, nickname = $2 where first_name = $3',
        arg: ['Robert', 'Rob', 'Matt']
      })
    })
  })
})
