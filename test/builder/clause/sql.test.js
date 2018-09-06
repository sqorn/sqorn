const { sq, query } = require('../tape')

describe('sql', () => {
  describe('template string', () => {
    query({
      name: 'raw select',
      query: sq.l`select 7`,
      text: 'select 7'
    })
    query({
      name: 'raw delete',
      query: sq.l`delete from book where id = 7`,
      text: 'delete from book where id = 7'
    })
    query({
      name: 'raw insert',
      query: sq.l`insert into book (title) values ('Oathbringer')`,
      text: `insert into book (title) values ('Oathbringer')`
    })
    query({
      name: 'raw update',
      query: sq.l`update person set age = age + 1`,
      text: 'update person set age = age + 1'
    })
  })
  describe('raw string', () => {
    query({
      name: 'simple',
      query: sq.l('select * from book'),
      text: 'select * from book'
    })
    query({
      name: 'arg',
      query: sq.l(`select * from book where id = ${3}`),
      text: 'select * from book where id = 3'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      query: sq.l`select * from $${'book'}`,
      text: 'select * from book'
    })
    query({
      name: '2 raw args',
      query: sq.l`select $${'title'} from $${'book'}`,
      text: 'select title from book'
    })
    query({
      name: '1 parameterized arg',
      query: sq.l`select ${8} * 2 as twice`,
      text: 'select $1 * 2 as twice',
      args: [8]
    })
    query({
      name: '2 parameterized args',
      query: sq.l`select ${8} * ${7} as product`,
      text: 'select $1 * $2 as product',
      args: [8, 7]
    })
    query({
      name: 'multiple raw and parameterized args',
      query: sq.l`select year, $${'title'} from $${'book'} where year < ${1980}`,
      text: 'select year, title from book where year < $1',
      args: [1980]
    })
  })
  describe('multiple calls', () => {
    query({
      name: '2 calls',
      query: sq.l`select * from book`.l`where id = ${7}`,
      text: 'select * from book where id = $1',
      args: [7]
    })
    query({
      name: '3 calls',
      query: sq.l`select * from book`.l`where genre = ${'fantasy'}`
        .l`or year = ${2000}`,
      text: 'select * from book where genre = $1 or year = $2',
      args: ['fantasy', 2000]
    })
  })
})
