const { sq, query } = require('../tape')

describe('clause', () => {
  test('ret', () => {
    query({
      qry: sq.ret`id`,
      txt: 'select id'
    })
  })
})
