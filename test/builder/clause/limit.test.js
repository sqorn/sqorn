const { sq, query } = require('../tape')

describe('Offset', () => {
  query({
    name: 'offset number',
    query: sq.from`person`.offset(8),
    text: 'select * from person offset $1',
    args: [8]
  })
  query({
    name: 'offset template string',
    query: sq.from`person`.offset`8`,
    text: 'select * from person offset 8',
    args: []
  })
  query({
    name: 'offset template string parameterized arg',
    query: sq.from`person`.offset`${8}`,
    text: 'select * from person offset $1',
    args: [8]
  })
  query({
    name: 'offset subquery arg',
    query: sq.from`person`.offset(sq.l`1 + 7`),
    text: 'select * from person offset 1 + 7',
    args: []
  })
  query({
    name: 'multiple offset',
    query: sq.from`person`.offset(7).offset(5),
    text: 'select * from person offset $1',
    args: [5]
  })
})
