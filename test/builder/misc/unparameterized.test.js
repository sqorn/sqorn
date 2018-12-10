const { sq } = require('../tape')

describe('unparameterized', () => {
  test('undefined', () => {
    expect(sq.txt`${undefined}`.unparameterized).toBe('default')
  })
  test('null', () => {
    expect(sq.txt`${null}`.unparameterized).toBe('null')
  })
  test('string', () => {
    expect(sq.txt`${'hi'}`.unparameterized).toBe("'hi'")
  })
  test('number', () => {
    expect(sq.txt`${123}`.unparameterized).toBe('123')
  })
  test('boolean', () => {
    expect(sq.txt`${true}`.unparameterized).toBe('true')
  })
  test('array of number', () => {
    expect(sq.txt`${[1, 2, 3]}`.unparameterized).toBe('array[1, 2, 3]')
  })
  test('array of string', () => {
    expect(sq.txt`${['a', 'b', 'c']}`.unparameterized).toBe(
      "array['a', 'b', 'c']"
    )
  })
  test('json', () => {
    expect(sq.txt`${{ a: 23, b: 'asdf' }}`.unparameterized).toBe(
      `'{"a":23,"b":"asdf"}'`
    )
  })
  test('subquery', () => {
    expect(sq.txt`${sq.txt`${true}`}`.unparameterized).toBe('true')
  })
  test('multiple args', () => {
    expect(
      sq
        .return(undefined)
        .return(null)
        .return(sq.txt('hi'))
        .return(23)
        .return(true)
        .return([1, 2, 3])
        .return(['a', 'b', 'c'])
        .return(sq.txt({ a: 23, b: 'asdf' }))
        .return(sq.txt`1`)
        .return(sq.return`1`).unparameterized
    ).toBe(
      `select default, null, 'hi', 23, true, array[1, 2, 3], array['a', 'b', 'c'], '{"a":23,"b":"asdf"}', 1, (select 1)`
    )
  })
})
