const operators = require('./operators')

const ExpressionBuilder = ({ dialect }) => (config = {}) => {
  const builder = {
    _build(ctx) {
      const tokens = []
      for (let token = this._token; token; token = token.prev)
        tokens.push(token.id ? token.id : token.args)
      return tokens.reverse()
    },
    query() {
      return this._build()
    }
  }
  const chain = createBuilder(builder)
}

const createBuilder = prototype => {
  const chain = prev => {
    const fn = (...args) => chain({ args, prev })
    fn.prev = prev
    Object.setPrototypeOf(fn, prototype)
    return fn
  }
  return chain
}

const createExpressionBuilder = operators => {
  const e = {}
  Object.values(operators).forEach(({ method, args, build }) => {
    e[method] = 3
  })
  return e
}

const e = createBuilder(ExpressionBuilder)
