const { sq, query } = require('../tape')

describe('return', () => {
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
  describe('string args', () => {
    query({
      name: 'one arg',
      query: sq.return('name'),
      text: 'select name'
    })
    query({
      name: 'two args',
      query: sq.return('id', 'name'),
      text: 'select id, name'
    })
  })
  describe('subquery args', () => {
    query({
      name: 'one arg',
      query: sq.return(sq.l`name`),
      text: 'select name'
    })
    query({
      name: 'two args',
      query: sq.return(sq.l`id`, sq.l`name`),
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
  describe('multiple calls', () => {
    query({
      name: '2 calls',
      query: sq.return`age`.return`name`,
      text: 'select age, name'
    })
    query({
      name: '3 calls',
      query: sq.return`age`.return`name`.return`id`,
      text: 'select age, name, id'
    })
    query({
      name: 'mixed calls',
      query: sq.return('age', 'name').return`id`,
      text: 'select age, name, id'
    })
  })
})
