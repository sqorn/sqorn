const context = require('./context')
const query = require('./query')

/** Transforms array of method call objects to SQL query string */
const compile = methods => {
  const ctx = context(methods)
  return query[ctx.type](ctx)
}

module.exports = compile
