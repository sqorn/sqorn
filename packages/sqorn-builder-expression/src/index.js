const createExpressionCompiler = require('./compile')

module.exports = ({ defaultContext, expression }) => {
  const { expressions } = expression
  const newContext = createNewContext(defaultContext)
  const compile = createExpressionCompiler(expressions)
  const builder = () => {} // must not be object literal
  const chain = createChain(builder)
  Object.defineProperties(builder, {
    ...builderProperties({ compile, newContext }),
    ...methodProperties({ expressions, chain })
  })
  return chain()
}

const builderProperties = ({ compile, newContext }) => ({
  _build: {
    value: function(inherit) {
      return compile(newContext(inherit), this.current)
    }
  },
  query: {
    get: function() {
      return this._build()
    }
  }
})

const createNewContext = defaultContext => {
  const { build, parameter, escape, mapKey } = defaultContext
  return inherit => {
    const { params = [], parameterize = true } = inherit || {}
    return {
      // sqorn instance properties
      build,
      parameter,
      escape,
      mapKey,

      // inherited properties
      params,
      parameterize
    }
  }
}

const createChain = prototype => {
  const chain = current => {
    const fn = (...args) => chain({ prev: current, args })
    fn.current = current
    Object.setPrototypeOf(fn, prototype)
    return fn
  }
  return chain
}

const methodProperties = ({ expressions, chain }) => {
  const properties = {}
  for (const name in expressions) {
    properties[name] = {
      get: function() {
        return chain({ prev: this.current, name })
      }
    }
  }
  return properties
}
