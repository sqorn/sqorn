const { sq, query } = require('../tape')

describe('set', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      query: sq.set`age = age + 1`,
      text: 'set age = age + 1'
    })
    query({
      name: '2 columns',
      query: sq.set`age = age + 1, updated = now()`,
      text: 'set age = age + 1, updated = now()'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      query: sq.set`${sq.raw('age')} = 7`,
      text: 'set age = 7'
    })
    query({
      name: '2 raw args',
      query: sq.set`${sq.raw('age')} = 7, ${sq.raw('name')} = 'Jo'`,
      text: `set age = 7, name = 'Jo'`
    })
    query({
      name: '1 parameterized arg',
      query: sq.set`age = ${7}, name = 'Jo'`,
      text: `set age = $1, name = 'Jo'`,
      args: [7]
    })
    query({
      name: '2 parameterized args',
      query: sq.set`age = ${7}, name = ${'Jo'}`,
      text: `set age = $1, name = $2`,
      args: [7, 'Jo']
    })
    query({
      name: 'multiple raw and parameterized args',
      query: sq.set`${sq.raw('age')} = ${7}, ${sq.raw('name')} = ${'Jo'}`,
      text: `set age = $1, name = $2`,
      args: [7, 'Jo']
    })
  })
  describe('object', () => {
    query({
      name: '1 column',
      query: sq.set({ age: sq.txt`age + 1` }),
      text: 'set age = age + 1'
    })
    query({
      name: '2 columns',
      query: sq.set({ age: sq.txt`age + 1`, updated: sq.txt`now()` }),
      text: 'set age = age + 1, updated = now()'
    })
    query({
      name: '1 parameterized arg',
      query: sq.set({ age: 7 }),
      text: `set age = $1`,
      args: [7]
    })
    query({
      name: '2 parameterized args',
      query: sq.set({ age: 7, name: 'Jo' }),
      text: `set age = $1, name = $2`,
      args: [7, 'Jo']
    })
    query({
      name: '3 parameterized args',
      query: sq.set({ age: 7, name: 'Jo', food: 'pizza' }),
      text: `set age = $1, name = $2, food = $3`,
      args: [7, 'Jo', 'pizza']
    })
    query({
      name: 'camelCase to snake_case key',
      query: sq.set({ firstName: 'Jo' }),
      text: `set first_name = $1`,
      args: ['Jo']
    })
  })
  describe('subquery', () => {
    query({
      name: 'manual',
      query: sq.from('person').set({ firstName: sq.txt`${'Bob'}` }),
      text: `update person set first_name = $1`,
      args: ['Bob']
    })
    query({
      name: 'select',
      query: sq.from('person').set({ firstName: sq.return`${'Bob'}` }),
      text: `update person set first_name = (select $1)`,
      args: ['Bob']
    })
  })
})
