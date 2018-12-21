const { sq, query } = require('../tape')

describe('Limit', () => {
  query({
    name: 'number',
    query: sq.from`person`.limit(8),
    text: 'select * from person limit $1',
    args: [8]
  })
  query({
    name: 'template string',
    query: sq.from`person`.limit`8`,
    text: 'select * from person limit 8',
    args: []
  })
  query({
    name: 'template string parameterized arg',
    query: sq.from`person`.limit`${8}`,
    text: 'select * from person limit $1',
    args: [8]
  })
  query({
    name: 'manual subquery',
    query: sq.from`person`.limit(sq.txt`1 + 7`),
    text: 'select * from person limit 1 + 7',
    args: []
  })
  query({
    name: 'select subquery',
    query: sq.from`person`.limit(sq.return(10)),
    text: 'select * from person limit (select $1)',
    args: [10]
  })
  query({
    name: 'multiple limit',
    query: sq.from`person`.limit(7).limit(5),
    text: 'select * from person limit $1',
    args: [5]
  })
})
