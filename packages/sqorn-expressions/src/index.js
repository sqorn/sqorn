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

function build() {
  if (arg === undefined) throw Error('Invalid Query: undefined parameter')
  return `$${this.params.push(arg)}`
}

const buildContext = ({ params = [] } = {}) => {
  return { params, build }
}

const buildCalls = current => {
  const calls = []
  for (; current; current = current.prev) {
    if (current.name) {
      calls.push(current)
    } else {
    }
  }
  return calls
}

// (can consume, args to consume)
// (true, N): consume args until expression
//                  e ?
//                  e(3) ?
//                  e.and(true)
// (true, 0):  -> consume expression
//                 e.eq(1)(2) ?
// (false, N): consume 1 arg
//                 e.and ?
//
// (false, N): consume 1 arg
//                 e.eq(1)
//                 e.arg
// (false, 1): consume1  -> consume 1 arg but not expression
//                 e.eq(1)?
// (false, 2): consume2  -> consume 2 args but not expressions
//                 e.eq

const createExpressionBuilder = expressions => (ctx, calls) => {
  if (calls.length === 0) throw Error('Error. Empty Expression')

  // let build
  // let minArgs
  // let maxArgs
  // let numArgs
  // let accumulate = []
  // let txt = ''

  // for (let i = 0; i < calls.length; ++i) {
  //   let { name, args } = calls[i]
  //   // First argument is special
  //   if (i === 0) {
  //     // first call is an expression
  //     if (name) {
  //       ;({ build, minArgs, maxArgs } = expressions[name])
  //       numArgs = 0
  //     } else {
  //       // first call is an argument
  //       ;({ build, minArgs, maxArgs } = expressions['arg'])
  //       numArgs = accumulate.push(build)
  //     }
  //   }
  //   // Remaining follow pattern
  //   else {
  //     if (numArgs < minArgs) {
  //     }
  //   }
}

const compileFirst = compiler => ctx => {}
const compileRest = compiler => ctx => {}

const compile = (count, build) => ctx => {
  const { args } = ctx
  if (ctx.argIndex + count >= args.length) {
  }
}

const createExpressions = () => {
  const expressions = {}
  Object.values(operators).forEach(operator => {
    expressions[name] = operator
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

console.log(e.eq(3)(5).query)
console.log(e(3).eq(5).query)
