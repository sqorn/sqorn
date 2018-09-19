const { conditions } = require('../util')

// 1. tagged template
// 2. ...[c in conditions] where c in:
//    a. call to sq.whr, sq.and, sq.or, or sq.not
//    b. object argument
module.exports = ctx => {
  if (ctx.whr.length === 0) return
  const txt = conditions(ctx)
  return txt && 'where ' + txt
}
