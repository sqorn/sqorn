const sqorn = require('../src/index.js')
const sq = sqorn()

// select

test('select - .frm``', () => {
  expect(sq.frm`person`.str).toBe('select * from person')
})

test('select - .frm``.ret``', () => {
  expect(sq.frm`person`.ret`age`.str).toBe('select age from person')
})

test('select - .frm``.whr``', () => {
  expect(sq.frm`person`.whr`age > 7`.str).toBe(
    'select * from person where age > 7'
  )
})

test('select - .frm``.whr``.ret``', () => {
  expect(sq.frm`person`.whr`age > 7`.ret`age`.str).toBe(
    'select age from person where age > 7'
  )
})

// delete

test('delete - .frm``', () => {
  expect(sq.del.frm`person`.str).toBe('delete from person')
})

test('delete - .frm``.ret``', () => {
  expect(sq.del.frm`person`.ret`age`.str).toBe(
    'delete from person returning age'
  )
})

test('delete - .frm``.whr``', () => {
  expect(sq.del.frm`person`.whr`age > 7`.str).toBe(
    'delete from person where age > 7'
  )
})

test('delete - .frm``.whr``.ret', () => {
  expect(sq.del.frm`person`.whr`age > 7`.ret`age`.str).toBe(
    'delete from person where age > 7 returning age'
  )
})

// insert

test('insert - .frm``.ins``.val``', () => {
  expect(sq.frm`person`.ins`first_name, last_name`.val`'John', 'Doe'`.str).toBe(
    `insert into person (first_name, last_name) values ('John', 'Doe')`
  )
})

test('insert - .frm``.ins``.val``.val``', () => {
  expect(
    sq.frm`person`.ins`first_name, last_name`.val`'John', 'Doe'`
      .val`'Carmen', 'San Diego'`.str
  ).toBe(
    `insert into person (first_name, last_name) values ('John', 'Doe'), ('Carmen', 'San Diego')`
  )
})

test('insert - .frm``.ins``.val``.ret``', () => {
  expect(
    sq.frm`person`.ins`first_name, last_name`.val`'John', 'Doe'`.ret`age`.str
  ).toBe(
    `insert into person (first_name, last_name) values ('John', 'Doe') returning age`
  )
})

// update

test('update - .frm``.upd``', () => {
  expect(sq.frm`person`.upd`age = age + 1`.str).toBe(
    'update person set age = age + 1'
  )
})

test('update - .frm`.whr``.upd``', () => {
  expect(sq.frm`person`.whr`age < 18`.upd`age = age + 1`.str).toBe(
    'update person set age = age + 1 where age < 18'
  )
})

test('update - .frm``.upd``.whr``', () => {
  expect(sq.frm`person`.upd`age = age + 1`.whr`age < 18`.str).toBe(
    'update person set age = age + 1 where age < 18'
  )
})

test('update - .frm``.upd``.ret``', () => {
  expect(sq.frm`person`.upd`age = age + 1`.ret`age`.str).toBe(
    'update person set age = age + 1 returning age'
  )
})

test('update - .frm``.whr``.upd``.ret``', () => {
  expect(sq.frm`person`.whr`age < 18`.upd`age = age + 1`.ret`age`.str).toBe(
    'update person set age = age + 1 where age < 18 returning age'
  )
})

// select express

test('select - `frm`', () => {
  expect(sq`person`.str).toBe('select * from person')
})

test('select - `frm``whr`', () => {
  expect(sq`person``age > 7`.str).toBe('select * from person where age > 7')
})

test('select - `frm``whr``ret`', () => {
  expect(sq`person``age > 7``age``age`.str).toBe(
    'select age from person where age > 7'
  )
})

test('select - `frm`.whr', () => {
  expect(sq`person`.whr`age > 7`.str).toBe('select * from person where age > 7')
})

test('select - `frm``whr`.ret', () => {
  expect(sq`person``age > 7`.ret`age`.str).toBe(
    'select age from person where age > 7'
  )
})

// test('insert - object', () => {
//   expect(sq.frm`person`.ins({ firstName: 'John', lastName: 'Doe' }).str).toBe(
//     `insert into person (first_name, last_name) values ('John', 'Doe')`
//   )
//   expect(
//     sq.frm`person`.ins(
//       { firstName: 'John', lastName: 'Doe' },
//       { firstName: 'Carmen', lastName: 'San Diego' }
//     ).str
//   ).toBe(`insert into person (first_name, last_name) values ('John', 'Doe')`)
// })
