const { sq, query } = require('../tape')

describe('clause', () => {
  test('ins', () => {
    query({
      qry: sq.ins`first_name`,
      txt: '(first_name)'
    })
  })
})
