const { sq, query } = require('../tape')

describe('from', () => {
  query({
    name: 'from',
    query: sq`book`,
    text: 'select * from book'
  })
  query({
    name: 'from-where',
    query: sq`book`.where`genre = 'Fantasy'`,
    text: "select * from book where (genre = 'Fantasy')"
  })
  query({
    name: 'from-where-return',
    query: sq`book``genre = 'Fantasy'``title`,
    text: "select title from book where (genre = 'Fantasy')"
  })
})
