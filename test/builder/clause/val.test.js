const { sq, query } = require('../tape')

describe('val', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      qry: sq.val`200`,
      txt: 'values (200)'
    })
    query({
      name: '2 column',
      qry: sq.val`200, 'Jo'`,
      txt: `values (200, 'Jo')`
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      qry: sq.val`$${200}, 'Jo'`,
      txt: `values (200, 'Jo')`
    })
    query({
      name: '2 raw args',
      qry: sq.val`$${200}, $${"'Jo'"}`,
      txt: `values (200, 'Jo')`
    })
    query({
      name: '1 parameterized arg',
      qry: sq.val`${200}, 'Jo'`,
      txt: `values ($1, 'Jo')`,
      arg: [200]
    })
    query({
      name: '2 paramterized args',
      qry: sq.val`${200}, ${'Jo'}`,
      txt: `values ($1, $2)`,
      arg: [200, 'Jo']
    })
    query({
      name: 'multiple raw and parameterized args',
      qry: sq.val`$${200}, ${'Jo'}, $${"'Bo'"}, ${7}`,
      txt: `values (200, $1, 'Bo', $2)`,
      arg: ['Jo', 7]
    })
  })
})
