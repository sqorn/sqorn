const { sq, query } = require('../tape')

describe('clause', () => {
  test('upd', () => {
    query({
      qry: sq.upd`age = age + 1`,
      txt: 'set age = age + 1'
    })
  })
})
