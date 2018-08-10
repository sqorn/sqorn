const { sq, query } = require('../tape')

describe('sql', () => {
  describe('template string', () => {
    query({
      name: 'raw select',
      qry: sq.l`select 7`,
      txt: 'select 7'
    })
    query({
      name: 'raw delete',
      qry: sq.l`delete from book where id = 7`,
      txt: 'delete from book where id = 7'
    })
    query({
      name: 'raw insert',
      qry: sq.l`insert into book (title) values ('Oathbringer')`,
      txt: `insert into book (title) values ('Oathbringer')`
    })
    query({
      name: 'raw update',
      qry: sq.l`update person set age = age + 1`,
      txt: 'update person set age = age + 1'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      qry: sq.l`select * from $${'book'}`,
      txt: 'select * from book'
    })
    query({
      name: '2 raw args',
      qry: sq.l`select $${'title'} from $${'book'}`,
      txt: 'select title from book'
    })
    query({
      name: '1 parameterized arg',
      qry: sq.l`select ${8} * 2 as twice`,
      txt: 'select $1 * 2 as twice',
      arg: [8]
    })
    query({
      name: '2 parameterized args',
      qry: sq.l`select ${8} * ${7} as product`,
      txt: 'select $1 * $2 as product',
      arg: [8, 7]
    })
    query({
      name: 'multiple raw and parameterized args',
      qry: sq.l`select year, $${'title'} from $${'book'} where year < ${1980}`,
      txt: 'select year, title from book where year < $1',
      arg: [1980]
    })
  })
})
