const { isTaggedTemplate } = require('sqorn-util')
const operators = require('./operators')

const ExpressionBuilder = ({ dialect }) => (config = {}) => {
  const builder = {
    _build(inherit) {
      const ctx = buildContext(inherit)
      const calls = buildCalls(this.current)
      return buildExpression(ctx, calls)
    },
    get query() {
      return this._build()
    }
  }
  const chain = createBuilder(builder)
  Object.defineProperties(builder, expressionProperties({ chain }))
  return chain()
}

function build(arg) {
  if (arg === undefined) throw Error('Invalid Query: undefined parameter')
  if (typeof arg === 'function') return arg._build(this)
  return `$${this.params.push(arg)}`
}

const buildContext = ({ params = [] } = {}) => {
  return { params, build }
}

const buildCalls = current => {
  // get call nodes
  const calls = []
  for (; current; current = current.prev) calls.push(current)
  if (calls.length === 0) throw Error('Error: Empty expression')
  calls.reverse()
  // build expression list
  let expression = { name: 'arg', args: [] }
  const expressions = [expression]
  for (let i = 0; i < calls.length; ++i) {
    const { name, args } = calls[i]
    if (i == 0) {
      if (name) expression.name = name
      else pushCall(expression.args, args)
    } else {
      if (name) {
        expression = { name, args: [] }
        expressions.push(expression)
      } else {
        pushCall(expression.args, args)
      }
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

const createExpressionBuilder = expressions => (ctx, calls) => {
  let exp
  for (let i = 0; i < calls.length; ++i) {
    const { name, args } = calls[i]
    const { build, minArgs, maxArgs } = expressions[name]
    const numArgs = args.length
    if (i === 0) {
      if (numArgs < minArgs)
        throw Error(`Error: ${name} requires at least ${minArgs} arguments`)
      if (numArgs > maxArgs)
        throw Error(`Error: ${name} accepts at most ${maxArgs} arguments`)
      exp = build(ctx, args)
    } else {
      if (numArgs + 1 < minArgs)
        throw Error(`Error: ${name} requires at least ${minArgs} arguments`)
      if (numArgs + 1 > maxArgs)
        throw Error(`Error: ${name} accepts at most ${maxArgs} arguments`)
      exp = build(ctx, [{ exp }, ...args])
    }
  }
  return exp
}

const createExpressions = () => {
  const expressions = {}
  Object.values(operators).forEach(operator => {
    expressions[operator.name] = operator
  })
  return expressions
}

const buildExpression = createExpressionBuilder(createExpressions())

const createBuilder = prototype => {
  const chain = current => {
    const fn = (...args) => chain({ prev: current, args })
    fn.current = current
    Object.setPrototypeOf(fn, prototype)
    return fn
  }
  return chain
}

const expressionProperties = ({ chain }) => {
  const properties = {}
  Object.values(operators).forEach(({ name }) => {
    properties[name] = {
      get: function() {
        return chain({ prev: this.current, name })
      }
    }
  })
  return properties
}

const e = ExpressionBuilder({})()

// console.log(JSON.stringify(e(5, 6, 7)(8).eq(3, 5).eq`meow`.query, null, 2))
// console.log(JSON.stringify(e.eq(3, 4).query, null, 2))
console.log(
  JSON.stringify(
    e(1, 2)
      .eq(3)
      .and(true).query,
    null,
    2
  )
)
console.log(
  JSON.stringify(
    e.eq(e(1).eq(2), 3).and(true, false, true).not.not.query,
    null,
    2
  )
)
// console.log(JSON.stringify(e(1, 2).eq(3).query, null, 2))
// console.log(JSON.stringify(e.and(true, false, true, false).query, null, 2))
// console.log(JSON.stringify(e.eq(3, 4).and(true).query, null, 2))
// console.log(e.eq(3)(5).query)
// console.log(e(3).eq(5).query)
