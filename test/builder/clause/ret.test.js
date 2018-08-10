const { sq, query } = require('../tape')

describe('ret', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      qry: sq.ret`id`,
      txt: 'select id'
    })
    query({
      name: '2 columns',
      qry: sq.ret`id, name`,
      txt: 'select id, name'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      qry: sq.ret`$${'age'}, name`,
      txt: 'select age, name'
    })
    query({
      name: '2 raw args',
      qry: sq.ret`$${'age'}, $${'name'}`,
      txt: 'select age, name'
    })
    query({
      name: '1 parameterized arg',
      qry: sq.ret`${7} as age, name`,
      txt: 'select $1 as age, name',
      arg: [7]
    })
    query({
      name: '2 parameterized args',
      qry: sq.ret`${7} as age, ${'Jo'} as name`,
      txt: 'select $1 as age, $2 as name',
      arg: [7, 'Jo']
    })
    query({
      name: 'multiple raw and parameterized args',
      qry: sq.ret`${7} as $${'age'}, ${'Jo'} as $${'name'}`,
      txt: 'select $1 as age, $2 as name',
      arg: [7, 'Jo']
    })
  })
})
