const { sq, query } = require('../tape')

describe('whr', () => {
  describe('template string', () => {
    query({
      name: '1 condition',
      qry: sq.whr`name = 'Jo'`,
      txt: "select * where name = 'Jo'"
    })
    query({
      name: '2 condition',
      qry: sq.whr`name = 'Jo' and age = 7`,
      txt: "select * where name = 'Jo' and age = 7"
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      qry: sq.whr`$${'name'} = 'Jo'`,
      txt: "select * where name = 'Jo'"
    })
    query({
      name: '2 raw args',
      qry: sq.whr`$${'name'} = $${"'Jo'"}`,
      txt: "select * where name = 'Jo'"
    })
    query({
      name: '1 parameterized arg',
      qry: sq.whr`name = ${'Jo'}`,
      txt: 'select * where name = $1',
      arg: ['Jo']
    })
    query({
      name: '2 paramterized args',
      qry: sq.whr`name = ${'Jo'} or name = ${'Mo'}`,
      txt: 'select * where name = $1 or name = $2',
      arg: ['Jo', 'Mo']
    })
    query({
      name: 'multiple raw and parameterized args',
      qry: sq.whr`$${'name'} = ${'Jo'} $${'or'} $${'name'} = ${'Mo'}`,
      txt: 'select * where name = $1 or name = $2',
      arg: ['Jo', 'Mo']
    })
  })
  describe('object', () => {
    query({
      name: '1 condition',
      qry: sq.whr({ age: 7 }),
      txt: 'select * where age = $1',
      arg: [7]
    })
    query({
      name: '2 conditions, and',
      qry: sq.whr({ age: 7, name: 'Jo' }),
      txt: 'select * where age = $1 and name = $2',
      arg: [7, 'Jo']
    })
    query({
      name: '3 conditions, and',
      qry: sq.whr({ age: 7, name: 'Jo', city: 'San Diego' }),
      txt: 'select * where age = $1 and name = $2 and city = $3',
      arg: [7, 'Jo', 'San Diego']
    })
    query({
      name: '2 conditions, or',
      qry: sq.whr({ age: 7 }, { name: 'Jo' }),
      txt: 'select * where age = $1 or name = $2',
      arg: [7, 'Jo']
    })
    query({
      name: '3 conditions, or',
      qry: sq.whr({ age: 7 }, { name: 'Jo' }, { city: 'San Diego' }),
      txt: 'select * where age = $1 or name = $2 or city = $3',
      arg: [7, 'Jo', 'San Diego']
    })
    query({
      name: 'and + or',
      qry: sq.whr({ age: 7 }, { name: 'Jo', city: 'San Diego' }),
      txt: 'select * where age = $1 or name = $2 and city = $3',
      arg: [7, 'Jo', 'San Diego']
    })
    query({
      name: 'camelCase to snake_case',
      qry: sq.whr({ firstName: 'Jo' }),
      txt: 'select * where first_name = $1',
      arg: ['Jo']
    })
  })
})
