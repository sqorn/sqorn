const { sq, query } = require('../tape')

describe('sql query - tagged template', () => {
  query({
    name: 'sql    - .l``',
    qry: sq.l`select * from person`,
    txt: 'select * from person'
  })
  query({
    name: 'sql    - .l``',
    qry: sq.l`select * from person where name = 'Bob' and age > 7`,
    txt: `select * from person where name = 'Bob' and age > 7`
  })
})

describe('select query - tagged template', () => {
  query({
    name: 'select - .frm``',
    qry: sq.frm`person`,
    txt: 'select * from person'
  })
  query({
    name: 'select - .frm``.ret``',
    qry: sq.frm`person`.ret`age`,
    txt: 'select age from person'
  })
  query({
    name: 'select - .frm``.whr``',
    qry: sq.frm`person`.whr`age > 7`,
    txt: 'select * from person where age > 7'
  })
  query({
    name: 'select - .frm``.whr``.ret``',
    qry: sq.frm`person`.whr`age > 7`.ret`age`,
    txt: 'select age from person where age > 7'
  })
})

describe('delete query - tagged template', () => {
  query({
    name: 'delete - .frm``',
    qry: sq.del.frm`person`,
    txt: 'delete from person'
  })
  query({
    name: 'delete - .frm``.ret``',
    qry: sq.del.frm`person`.ret`age`,
    txt: 'delete from person returning age'
  })
  query({
    name: 'delete - .frm``.whr``',
    qry: sq.del.frm`person`.whr`age > 7`,
    txt: 'delete from person where age > 7'
  })
  query({
    name: 'delete - .frm``.whr``.ret',
    qry: sq.del.frm`person`.whr`age > 7`.ret`age`,
    txt: 'delete from person where age > 7 returning age'
  })
})

describe('insert query - tagged template', () => {
  query({
    name: 'insert - .frm``.ins``.val``',
    qry: sq.frm`person`.ins`first_name, last_name`.val`'John', 'Doe'`,
    txt: `insert into person (first_name, last_name) values ('John', 'Doe')`
  })
  query({
    name: 'insert - .frm``.ins``.val``.val``',
    qry: sq.frm`person`.ins`first_name, last_name`.val`'John', 'Doe'`
      .val`'Carmen', 'San Diego'`,
    txt: `insert into person (first_name, last_name) values ('John', 'Doe'), ('Carmen', 'San Diego')`
  })
  query({
    name: 'insert - .frm``.ins``.val``.ret``',
    qry: sq.frm`person`.ins`first_name, last_name`.val`'John', 'Doe'`.ret`age`,
    txt: `insert into person (first_name, last_name) values ('John', 'Doe') returning age`
  })
})

describe('update query - tagged template', () => {
  query({
    name: 'update - .frm``.upd``',
    qry: sq.frm`person`.upd`age = age + 1`,
    txt: 'update person set age = age + 1'
  })
  query({
    name: 'update - .frm`.whr``.upd``',
    qry: sq.frm`person`.whr`age < 18`.upd`age = age + 1`,
    txt: 'update person set age = age + 1 where age < 18'
  })
  query({
    name: 'update - .frm``.upd``.whr``',
    qry: sq.frm`person`.upd`age = age + 1`.whr`age < 18`,
    txt: 'update person set age = age + 1 where age < 18'
  })
  query({
    name: 'update - .frm``.upd``.ret``',
    qry: sq.frm`person`.upd`age = age + 1`.ret`age`,
    txt: 'update person set age = age + 1 returning age'
  })
  query({
    name: 'update - .frm``.whr``.upd``.ret``',
    qry: sq.frm`person`.whr`age < 18`.upd`age = age + 1`.ret`age`,
    txt: 'update person set age = age + 1 where age < 18 returning age'
  })
})

describe('express query - tagged template', () => {
  query({
    name: 'select - `frm`',
    qry: sq`person`,
    txt: 'select * from person'
  })
  query({
    name: 'select - `frm``whr`',
    qry: sq`person``age > 7`,
    txt: 'select * from person where age > 7'
  })
  query({
    name: 'select - `frm``whr``ret`',
    qry: sq`person``age > 7``age``age`,
    txt: 'select age from person where age > 7'
  })
  query({
    name: 'select - `frm`.whr',
    qry: sq`person`.whr`age > 7`,
    txt: 'select * from person where age > 7'
  })
  query({
    name: 'select - `frm``whr`.ret',
    qry: sq`person``age > 7`.ret`age`,
    txt: 'select age from person where age > 7'
  })
})

describe('select query - tagged template args', () => {
  query({
    name: 'select - .frm``.whr`${int}`',
    qry: sq.frm`person`.whr`age > ${7}`,
    txt: 'select * from person where age > $1',
    arg: [7]
  })
  query({
    name: 'select - .frm``.whr`${int}${int}`',
    qry: sq.frm`person`.whr`age >= ${20} and age <= ${29}`,
    txt: 'select * from person where age >= $1 and age <= $2',
    arg: [20, 29]
  })
  query({
    name: 'select - .frm``.whr`${string}`',
    qry: sq.frm`person`.whr`name = ${'bob'}`,
    txt: 'select * from person where name = $1',
    arg: ['bob']
  })
  query({
    name: 'select - .frm``.whr`${object}`',
    qry: sq.frm`person`.whr`name = ${'bob'}`,
    txt: 'select * from person where name = $1',
    arg: ['bob']
  })
})

describe('sql query - tagged template args', () => {
  query({
    name: 'select - .l`${int}`',
    qry: sq.l`select * from person where age > ${7}`,
    txt: 'select * from person where age > $1',
    arg: [7]
  })
  query({
    name: 'select - .l`${int}${string}`',
    qry: sq.l`select * from person where age > ${7} or name = ${'Bob'}`,
    txt: `select * from person where age > $1 or name = $2`,
    arg: [7, 'Bob']
  })
})

describe('query - tagged template sql arg', () => {
  query({
    name: 'select - .l`${sq``}`',
    qry: sq`(${sq`person``age > 7`})`.ret`name`,
    txt: 'select name from (select * from person where age > 7)',
    arg: []
  })
})

describe('query - tagged template $raw arg', () => {
  query({
    name: 'select - .frm`$${string}`',
    qry: sq.frm`$${'person'}`,
    txt: 'select * from person',
    arg: []
  })
})
