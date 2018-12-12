declare let e: NewExpression;

const r = e.like('asdf')('asdf').escape('')
const s = e`asdf`.number.eq(23)
