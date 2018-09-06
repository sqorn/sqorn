const { sq, query } = require('../tape')

describe('ret', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      query: sq.return`id`,
      text: 'select id'
    })
    query({
      name: '2 columns',
      query: sq.return`id, name`,
      text: 'select id, name'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      query: sq.return`$${'age'}, name`,
      text: 'select age, name'
    })
    query({
      name: '2 raw args',
      query: sq.return`$${'age'}, $${'name'}`,
      text: 'select age, name'
    })
    query({
      name: '1 parameterized arg',
      query: sq.return`${7} as age, name`,
      text: 'select $1 as age, name',
      args: [7]
    })
    query({
      name: '2 parameterized args',
      query: sq.return`${7} as age, ${'Jo'} as name`,
      text: 'select $1 as age, $2 as name',
      args: [7, 'Jo']
    })
    query({
      name: 'multiple raw and parameterized args',
      query: sq.return`${7} as $${'age'}, ${'Jo'} as $${'name'}`,
      text: 'select $1 as age, $2 as name',
      args: [7, 'Jo']
    })
  })
})
