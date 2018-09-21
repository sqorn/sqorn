const { sq, query } = require('../tape')

describe('Limit', () => {
  query({
    name: 'limit number',
    query: sq.from`person`.limit(8),
    text: 'select * from person limit $1',
    args: [8]
  })
  query({
    name: 'limit template string',
    query: sq.from`person`.limit`8`,
    text: 'select * from person limit 8',
    args: []
  })
  query({
    name: 'limit template string parameterized arg',
    query: sq.from`person`.limit`${8}`,
    text: 'select * from person limit $1',
    args: [8]
  })
  query({
    name: 'multiple limit',
    query: sq.from`person`.limit(7).limit(5),
    text: 'select * from person limit $1',
    args: [5]
  })
})
