const { sq, query } = require('../tape')

describe('Group By', () => {
  query({
    name: 'simple',
    query: sq.from`person`.group`age`,
    text: 'select * from person group by age',
    args: []
  })
  query({
    name: 'two calls',
    query: sq.from`person`.group`age`.group`last_name`,
    text: 'select * from person group by age, last_name',
    args: []
  })
  query({
    name: 'three calls',
    query: sq.from`person`.group`age`.group`last_name`.group`first_name`,
    text: 'select * from person group by age, last_name, first_name',
    args: []
  })
})
