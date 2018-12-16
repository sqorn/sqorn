declare let e: NewExpression;
declare let table: TableExpression;

const r = e('asdf').like('asdf').escape('')
const s = e.number`asdf`.eq(23)


const u = e.eqAny('', [])

const t = e([true])
e.eqSome(true, e([false]))
const t2 = e.eqAny(3, [2,3])

e(3).eqAny(table)

e.ltAny(e.json(3), [3, {}, true])

const r2 = e('a').likeAny(['b'])
e.notLikeAll('b', table)
e.eqAny``([])

e.notLike