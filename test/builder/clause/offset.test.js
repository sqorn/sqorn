const { sq, query } = require('../tape')

describe('Offset', () => {
  query({
    name: 'number',
    query: sq.from`person`.offset(8),
    text: 'select * from person offset $1',
    args: [8]
  })
  query({
    name: 'template string',
    query: sq.from`person`.offset`8`,
    text: 'select * from person offset 8',
    args: []
  })
  query({
    name: 'template string parameterized arg',
    query: sq.from`person`.offset`${8}`,
    text: 'select * from person offset $1',
    args: [8]
  })
  query({
    name: 'manual subquery',
    query: sq.from`person`.offset(sq.txt`1 + 7`),
    text: 'select * from person offset 1 + 7',
    args: []
  })
  query({
    name: 'select subquery',
    query: sq.from`person`.offset(sq.return(10)),
    text: 'select * from person offset (select $1)',
    args: [10]
  })
  query({
    name: 'multiple offset',
    query: sq.from`person`.offset(7).offset(5),
    text: 'select * from person offset $1',
    args: [5]
  })
})
