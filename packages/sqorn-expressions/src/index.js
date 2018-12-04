const build1 = (ctx, arg) => {
  if (typeof arg === 'function') return ctx.build(arg)
  if (typeof arg === 'string') return arg
  return ctx.parameter(arg)
}

const build2 = (ctx, arg) => {
  if (typeof arg === 'function') return ctx.build(arg)
  return ctx.parameter(arg)
}

/** ****
 *
 */
const e = arg => ctx => build2(ctx, arg)

/** **eq**
 *
 */
e.eq = (a, b) => ctx => `(${build1(ctx, a)} = ${build2(ctx, b)})`

/** **neq**
 *
 */
e.neq = (a, b) => ctx => `(${build1(ctx, a)} <> ${build2(ctx, b)})`

/** **lt**
 *
 */
e.lt = (a, b) => ctx => `(${build1(ctx, a)} < ${build2(ctx, b)})`

/** **lte**
 *
 */
e.lte = (a, b) => ctx => `(${build1(ctx, a)} <= ${build2(ctx, b)})`

/** **gt**
 *
 */
e.gt = (a, b) => ctx => `(${build1(ctx, a)} > ${build2(ctx, b)})`

/** **gte**
 *
 */
e.gte = (a, b) => ctx => `(${build1(ctx, a)} >= ${build2(ctx, b)})`

/** **between**
 *
 */
/** **notBetween**
 *
 */
/** **isDistinct**
 *
 */
/** **isNotDistinct**
 *
 */
/** **isNull**
 *
 */
/** **isNotNull**
 *
 */
/** **true**
 *
 */
/** **notTrue**
 *
 */
/** **false**
 *
 */
/** **notFalse**
 *
 */
/** **unknown**
 *
 */
/** **notUnknown**
 *
 */
/** **exists**
 *
 */
/** **notExists**
 *
 */
/** **in**
 * Discuss how it is TWO different operators: One for sets, one for Postgres arrays.
 *
 * * `row in (set)` and `row = any (set)` are equivalent
 *
 * * `row in (v1, v2, v3, ...vn)` and `row = any (array)` are equivalent
 */
e.in = (item, candidates) => ctx => `${item} in ${candidates}`
/** **notIn**
 *
 */
/** **any**
 *
 */
/** **some**
 *
 */
/** **all**
 *
 */
/** **like**
 *
 */
/** **notLike**
 *
 */
/** **similarTo**
 *
 */
/** **notSimilarTo**
 *
 */

module.exports = e
