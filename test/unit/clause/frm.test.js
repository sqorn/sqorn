const { sq, query } = require('../tape')

describe('clause', () => {
  test('frm', () => {
    query({
      qry: sq.frm`book`,
      txt: 'select * from book'
    })
  })
})
