const { sq, query } = require('../tape')

describe('clause', () => {
  test('whr', () => {
    query({
      qry: sq.whr`name = 'Jo'`,
      txt: "select * where name = 'Jo'"
    })
  })
})
