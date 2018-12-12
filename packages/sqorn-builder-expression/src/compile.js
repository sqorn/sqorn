const { isTaggedTemplate } = require('@sqorn/lib-util')

const compileExpression = (ctx, current) =>
  buildExpression(ctx, buildCalls(current))

// TODO: Performance optimization:
// inline expression building with this method so at most only one array
// is allocated in total, no array of object containing arrays nonsense
const buildCalls = current => {
  // get call nodes
  const calls = []
  for (; current; current = current.prev) calls.push(current)
  if (calls.length === 0) throw Error('Error: Empty expression')
  // build expression list
  let expression = { name: 'arg', args: [] }
  const expressions = [expression]
  const last = calls.length - 1
  for (let i = last; i >= 0; --i) {
    const { name, args } = calls[i]
    if (i === last) {
      if (name) expression.name = name
      else pushCall(expression.args, args)
    } else {
      if (name) expressions.push((expression = { name, args: [undefined] }))
      else pushCall(expression.args, args)
    }
  }
  return expressions
}

const pushCall = (array, args) => {
  if (isTaggedTemplate(args)) {
    array.push({ tag: args })
  } else {
    if (args.length === 0)
      throw Error('Error: Expression call requires at least one argument')
    for (let i = 0; i < args.length; ++i) {
      array.push({ arg: args[i] })
    }
  }
}

// /** Constructs expression table from object of expressions */
// const createExpressionTable = expressions => {
//   const table = {}
//   Object.values(operators).forEach(operator => {
//     table[expressions.name] = operator
//   })
//   return table
// }

const createExpressionBuilder = expressions => (ctx, calls) => {
  let exp
  for (let i = 0; i < calls.length; ++i) {
    const { name, args } = calls[i]
    const { build, minArgs, maxArgs } = expressions[name]
    if (i !== 0) args[0] = { exp }
    const numArgs = args.length
    if (numArgs < minArgs)
      throw Error(`Error: ${name} requires at least ${minArgs} arguments`)
    if (numArgs > maxArgs)
      throw Error(`Error: ${name} accepts at most ${maxArgs} arguments`)
    exp = build(ctx, args)
  }
  return exp
}

module.exports = {
  compileExpression,
  createExpressionTable,
  createExpressionBuilder
}
