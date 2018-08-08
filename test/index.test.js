const sqorn = require('../src/index.js')
const sq = sqorn()

describe('sql query - tagged template', () => {
  test('sql    - .l``', () => {
    expect(sq.l`select * from person`.str).toBe('select * from person')
  })

  test('sql    - .l``', () => {
    expect(
      sq.l`select * from person where name = 'Bob' and age > 7`.qry
    ).toEqual({
      txt: `select * from person where name = 'Bob' and age > 7`,
      arg: []
    })
  })
})

describe('raw query - tagged template', () => {
  test('raw    - .raw``', () => {
    expect(sq.raw`select * from person`.str).toBe('select * from person')
  })

  test('raw    - .raw``', () => {
    expect(
      sq.raw`select * from person where name = 'Bob' and age > 7`.qry
    ).toEqual({
      txt: `select * from person where name = 'Bob' and age > 7`,
      arg: []
    })
  })
})

describe('select query - tagged template', () => {
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
})

describe('delete query - tagged template', () => {
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
})

describe('insert query - tagged template', () => {
  test('insert - .frm``.ins``.val``', () => {
    expect(
      sq.frm`person`.ins`first_name, last_name`.val`'John', 'Doe'`.str
    ).toBe(`insert into person (first_name, last_name) values ('John', 'Doe')`)
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
})

describe('update query - tagged template', () => {
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
})

describe('express query - tagged template', () => {
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
    expect(sq`person`.whr`age > 7`.str).toBe(
      'select * from person where age > 7'
    )
  })

  test('select - `frm``whr`.ret', () => {
    expect(sq`person``age > 7`.ret`age`.str).toBe(
      'select age from person where age > 7'
    )
  })
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

describe('select query - tagged template args', () => {
  test('select - .frm``.whr`${int}`', () => {
    expect(sq.frm`person`.whr`age > ${7}`.qry).toEqual({
      txt: 'select * from person where age > $1',
      arg: [7]
    })
  })

  test('select - .frm``.whr`${int}${int}`', () => {
    expect(sq.frm`person`.whr`age >= ${20} and age <= ${29}`.qry).toEqual({
      txt: 'select * from person where age >= $1 and age <= $2',
      arg: [20, 29]
    })
  })

  test('select - .frm``.whr`${string}`', () => {
    expect(sq.frm`person`.whr`name = ${'bob'}`.qry).toEqual({
      txt: 'select * from person where name = $1',
      arg: ['bob']
    })
  })

  test('select - .frm``.whr`${object}`', () => {
    expect(sq.frm`person`.whr`name = ${'bob'}`.qry).toEqual({
      txt: 'select * from person where name = $1',
      arg: ['bob']
    })
  })
})

describe('sql query - tagged template args', () => {
  test('select - .l`${int}`', () => {
    expect(sq.l`select * from person where age > ${7}`.qry).toEqual({
      txt: 'select * from person where age > $1',
      arg: [7]
    })
  })

  test('select - .l`${int}${string}`', () => {
    expect(
      sq.l`select * from person where age > ${7} or name = ${'Bob'}`.qry
    ).toEqual({
      txt: `select * from person where age > $1 or name = $2`,
      arg: [7, 'Bob']
    })
  })
})

describe('raw query - tagged template args', () => {
  test('select - .raw`${int}`', () => {
    expect(sq.raw`select * from person where age > ${7}`.qry).toEqual({
      txt: 'select * from person where age > 7',
      arg: []
    })
  })

  test('select - .raw`${int}${string}`', () => {
    expect(
      sq.raw`select * from person where age > ${7} or name = '${'Bob'}'`.qry
    ).toEqual({
      txt: `select * from person where age > 7 or name = 'Bob'`,
      arg: []
    })
  })
})

describe('query - tagged template sql arg', () => {
  test('select - .l`${sq``}`', () => {
    const sub = sq`person``age > 7`
    const qry = sq`(${sub})`.ret`name`
    expect(qry.qry).toEqual({
      txt: 'select name from (select * from person where age > 7)',
      arg: []
    })
  })
})

describe('query - tagged template raw arg', () => {
  test('select - .frm`${.raw`${string}`}`', () => {
    expect(sq.frm`${sq.raw`person`}`.qry).toEqual({
      txt: 'select * from person',
      arg: []
    })
  })
})

describe('query - tagged template $raw arg', () => {
  test('select - .frm`$${string}`', () => {
    expect(sq.frm`$${'person'}`.qry).toEqual({
      txt: 'select * from person',
      arg: []
    })
  })
})
