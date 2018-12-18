const { sq, e, query } = require('../tape')

const tester = (text, expression) => {
  test(text, () => {
    expect(expression.query.text).toEqual(text)
  })
}

describe('Parentheses', () => {
  tester('$1', e(1))
  tester('$1', e(e(1)))
  tester('$1', e(e(e(1))))
  tester('moo', e`moo`)
  tester('moo', e(e`moo`))
  tester('moo', e(e(e`moo`)))
  tester('($1 + $2)', e.add(1, 2))
  tester('($1 + $2)', e(e.add(1, 2)))
  tester('($1 + $2)', e(e(e.add(e(1), e(e(2))))))
  tester('(($1 + $2) + $3)', e.add(1, 2).add(3))
  tester('($1 + ($2 + $3))', e.add(1, e.add(2, 3)))
})
