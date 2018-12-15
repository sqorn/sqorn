declare let e: NewExpression;

const r = e('asdf').like('asdf').escape('')
const s = e.number`asdf`.eq(23)


e(true)(false)