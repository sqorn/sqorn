const { sq, e, query } = require('../tape')

describe('Having', () => {
  query({
    name: 'simple',
    query: sq.from`book`.groupBy`age`.having`age > 7`,
    text: 'select * from book group by age having (age > 7)'
  })
  query({
    name: '2 calls',
    query: sq.from`book`.groupBy`age`.having`age > 7`.having`age < 10`,
    text: 'select * from book group by age having (age > 7) and (age < 10)'
  })
  query({
    name: 'object args',
    query: sq.from`book`.groupBy`age`.having(
      { age: 7 },
      { age: 9 },
      sq.txt`(age < ${10})`
    ),
    text:
      'select * from book group by age having (age = $1) and (age = $2) and (age < $3)',
    args: [7, 9, 10]
  })
  query({
    name: 'mixed calls',
    query: sq.from`book`.groupBy`age`.having({ age: 7 }).having`age > ${9}`,
    text: 'select * from book group by age having (age = $1) and (age > $2)',
    args: [7, 9]
  })
  query({
    name: '.multip',
    query: sq.from`book`.groupBy`age`.having(e`age`.gt(7).or(e`age`.lt(9))),
    text: 'select * from book group by age having ((age > $1) or (age < $2))',
    args: [7, 9]
  })
})
