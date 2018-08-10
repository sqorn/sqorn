const { sq, query } = require('../tape')

describe('upd', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      qry: sq.upd`age = age + 1`,
      txt: 'set age = age + 1'
    })
    query({
      name: '2 columns',
      qry: sq.upd`age = age + 1, updated = now()`,
      txt: 'set age = age + 1, updated = now()'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      qry: sq.upd`$${'age'} = 7`,
      txt: 'set age = 7'
    })
    query({
      name: '2 raw args',
      qry: sq.upd`$${'age'} = 7, $${'name'} = 'Jo'`,
      txt: `set age = 7, name = 'Jo'`
    })
    query({
      name: '1 parameterized arg',
      qry: sq.upd`age = ${7}, name = 'Jo'`,
      txt: `set age = $1, name = 'Jo'`,
      arg: [7]
    })
    query({
      name: '2 parameterized args',
      qry: sq.upd`age = ${7}, name = ${'Jo'}`,
      txt: `set age = $1, name = $2`,
      arg: [7, 'Jo']
    })
    query({
      name: 'multiple raw and parameterized args',
      qry: sq.upd`$${'age'} = ${7}, $${'name'} = ${'Jo'}`,
      txt: `set age = $1, name = $2`,
      arg: [7, 'Jo']
    })
  })
})
