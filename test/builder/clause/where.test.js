const { sq, query } = require('../tape')
const { e } = sq

describe('where', () => {
  describe('template string', () => {
    query({
      name: '1 condition',
      query: sq.where`name = 'Jo'`,
      text: "select * where (name = 'Jo')"
    })
    query({
      name: '2 condition',
      query: sq.where`name = 'Jo' and age = 7`,
      text: "select * where (name = 'Jo' and age = 7)"
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      query: sq.where`$${'name'} = 'Jo'`,
      text: "select * where (name = 'Jo')"
    })
    query({
      name: '2 raw args',
      query: sq.where`$${'name'} = $${"'Jo'"}`,
      text: "select * where (name = 'Jo')"
    })
    query({
      name: '1 parameterized arg',
      query: sq.where`name = ${'Jo'}`,
      text: 'select * where (name = $1)',
      args: ['Jo']
    })
    expect(() => sq.where`name is ${undefined}`.query).toThrowError()
    query({
      name: 'null arg',
      query: sq.where`name = ${null}`,
      text: 'select * where (name = $1)',
      args: [null]
    })
    query({
      name: '2 paramterized args',
      query: sq.where`name = ${'Jo'} or name = ${'Mo'}`,
      text: 'select * where (name = $1 or name = $2)',
      args: ['Jo', 'Mo']
    })
    query({
      name: 'multiple raw and parameterized args',
      query: sq.where`$${'name'} = ${'Jo'} $${'or'} $${'name'} = ${'Mo'}`,
      text: 'select * where (name = $1 or name = $2)',
      args: ['Jo', 'Mo']
    })
  })
  describe('expression', () => {
    query({
      name: '1 value',
      query: sq.where(e(true)),
      text: 'select * where (age = $1)',
      args: [7]
    })
    query({
      name: '1 condition',
      query: sq.where(e.eq`age`(7)),
      text: 'select * where (age = $1)',
      args: [7]
    })
    query({
      name: '2 conditions',
      query: sq.where(e.gt`age`(7), e`age`.lt(10)),
      text: 'select * where (age > $1) and (age < $2)',
      args: [7, 10]
    })
  })
  describe('object', () => {
    query({
      name: '1 condition',
      query: sq.where({ age: 7 }),
      text: 'select * where (age = $1)',
      args: [7]
    })
    query({
      name: '2 conditions, and',
      query: sq.where({ age: 7, name: 'Jo' }),
      text: 'select * where (age = $1 and name = $2)',
      args: [7, 'Jo']
    })
    query({
      name: '3 conditions, and',
      query: sq.where({ age: 7, name: 'Jo', city: 'San Diego' }),
      text: 'select * where (age = $1 and name = $2 and city = $3)',
      args: [7, 'Jo', 'San Diego']
    })
    query({
      name: '2 conditions, or',
      query: sq.where({ age: 7 }, { name: 'Jo' }),
      text: 'select * where (age = $1 or name = $2)',
      args: [7, 'Jo']
    })
    query({
      name: '3 conditions, or',
      query: sq.where({ age: 7 }, { name: 'Jo' }, { city: 'San Diego' }),
      text: 'select * where (age = $1 or name = $2 or city = $3)',
      args: [7, 'Jo', 'San Diego']
    })
    query({
      name: 'and + or',
      query: sq.where({ age: 7 }, { name: 'Jo', city: 'San Diego' }),
      text: 'select * where (age = $1 or name = $2 and city = $3)',
      args: [7, 'Jo', 'San Diego']
    })
    query({
      name: 'camelCase to snake_case',
      query: sq.where({ firstName: 'Jo' }),
      text: 'select * where (first_name = $1)',
      args: ['Jo']
    })
  })
  describe('subquery argument', () => {
    query({
      name: 'one subquery',
      query: sq.where(sq.txt`first_name = ${'Jo'}`),
      text: 'select * where (first_name = $1)',
      args: ['Jo']
    })
    query({
      name: 'two subqueries',
      query: sq.where(
        sq.txt`first_name = ${'Jo'}`,
        sq.txt`last_name = ${'Schmo'}`
      ),
      text: 'select * where (first_name = $1 or last_name = $2)',
      args: ['Jo', 'Schmo']
    })
  })
  describe('multiple calls', () => {
    query({
      name: 'template string, 2 args',
      query: sq.where`name = ${'Jo'}`.where`city = ${'San Diego'}`,
      text: 'select * where (name = $1) and (city = $2)',
      args: ['Jo', 'San Diego']
    })
    query({
      name: 'template string, 3 args',
      query: sq.where`name = ${'Jo'}`.where`city = ${'San Diego'}`
        .where`age = ${20}`,
      text: 'select * where (name = $1) and (city = $2) and (age = $3)',
      args: ['Jo', 'San Diego', 20]
    })
    query({
      name: 'object',
      query: sq.where({ name: 'Jo' }).where({ city: 'San Diego' }),
      text: 'select * where (name = $1) and (city = $2)',
      args: ['Jo', 'San Diego']
    })
    query({
      name: 'complex',
      query: sq.where(
        { firstName: 'Jo', lastName: 'Schmo' },
        { middleName: 'Jo' }
      ).where`city = ${'San Diego'}`,
      text:
        'select * where (first_name = $1 and last_name = $2 or middle_name = $3) and (city = $4)',
      args: ['Jo', 'Schmo', 'Jo', 'San Diego']
    })
  })
})
