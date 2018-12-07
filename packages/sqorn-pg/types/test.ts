declare let e: NewExpression;

const a1 = e.and(true)
const a2 = a1(true)
const b1 = e.or(true, false)
const b2 = e.or(true, null)
const b3 = e.not(true)

const c1 = e(true).and(e.not(true).or(false))
const c2 = e(true).and(false).eq(true)
const c3 = e.add

const d1 = e.add(null)(true).eq(null)
const d2 = e.eq(1, 8)
const d3 = e.eq(e.not(true), e.and(true, false))
const d4 = e.eq(true, e.not(true))

const e1 = e.eq(null, null)
const e2 = e.eq(null, 2)
const e3 = e.eq(2, null)
const e4 = e.eq(1)

const f1 = e.subtract(e.add(3, 4), 23).add(23).divide(null)
const f2 = e.add(2, 3, 4).subtract(4, 5, 6)

const g1 = e.and(true, false)(true)(false)(e.eq(2,3), null)

const h1 = e.lt(3, 4).and(true).gt(false)
const h2 = e(true).gt(false).and(true)
const h3 = e(1).gt(3)

const i1 = e.neq(null, 2)

const j1 = e.between(3, 4, 5)
const j2 = j1.notBetween(true, false).between(true)(false).gte(false)
const j3 = e.between`b`(2, true)
const j4 = e.between(2)`b`(false);

const k1 = e.eq(98)`n`
const k2 = e.eq`n`(98)


declare let subquery: SubqueryExpression
const l1 = e.exists(subquery)
const l2 = e(subquery).exists
const l3 = e(null)
const l4 = e(null).notExists

const m1 = e(3).in(subquery)
const m2 = e.notIn(null, subquery)
const m3 = e.any(3, subquery).some(subquery)
const m4 = e.all(2, subquery).all(23)

const n1 = e.in(3, [1, e.add(3, 4), null, 34])
const n2 = e(true).in([null, true, false, e.eq(1, 2)])
const n3 = e(null).in([1, 2, 3, null, false]).in([]).notIn([true])
const n4 = e.notIn(3, [1, 2, 3])
const n5 = e(true).notIn([false, e(true), null])