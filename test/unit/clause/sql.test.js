const { sq, query } = require('../tape')

describe('clause', () => {
  test('sql', () => {
    query({
      qry: sq.l`select 7`,
      txt: 'select 7'
    })
  })
})
