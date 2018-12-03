const { sq } = require('../tape')

describe('unparameterized', () => {
  test('undefined', () => {
    expect(sq.l`${undefined}`.unparameterized).toBe('default')
  })
  test('null', () => {
    expect(sq.l`${null}`.unparameterized).toBe('null')
  })
  test('string', () => {
    expect(sq.l`${'hi'}`.unparameterized).toBe("'hi'")
  })
  test('number', () => {
    expect(sq.l`${123}`.unparameterized).toBe('123')
  })
  test('boolean', () => {
    expect(sq.l`${true}`.unparameterized).toBe('true')
  })
  test('array of number', () => {
    expect(sq.l`${[1, 2, 3]}`.unparameterized).toBe('array[1, 2, 3]')
  })
  test('array of string', () => {
    expect(sq.l`${['a', 'b', 'c']}`.unparameterized).toBe(
      "array['a', 'b', 'c']"
    )
  })
  test('json', () => {
    expect(sq.l`${{ a: 23, b: 'asdf' }}`.unparameterized).toBe(
      `'{"a":23,"b":"asdf"}'`
    )
  })
  test('subquery', () => {
    expect(sq.l`${sq.l`${true}`}`.unparameterized).toBe('true')
  })
  test('multiple args', () => {
    expect(
      sq
        .return(undefined)
        .return(null)
        .return(sq.l('hi'))
        .return(23)
        .return(true)
        .return([1, 2, 3])
        .return(['a', 'b', 'c'])
        .return(sq.l({ a: 23, b: 'asdf' }))
        .return(sq.l`1`)
        .return(sq.return`1`).unparameterized
    ).toBe(
      `select default, null, 'hi', 23, true, array[1, 2, 3], array['a', 'b', 'c'], '{"a":23,"b":"asdf"}', 1, (select 1)`
    )
  })
})
