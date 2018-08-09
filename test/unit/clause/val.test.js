const { sq, query } = require('../tape')

describe('clause', () => {
  test('val', () => {
    query({
      qry: sq.val`200`,
      txt: 'values (200)'
    })
  })
})
