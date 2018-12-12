module.exports = ({ defaultContext, expression, config = {} }) => {
  const { expressions } = dialect
  const newContext = newContextCreator()
  const compile = createExpressionBuilder(expressions)
  const builder = {}
  Object.defineProperties(builder, {
    ...builderProperties({ compile, newContext })
  })
  const chain = createBuilder(builder)
  Object.defineProperties(builder, expressionProperties({ chain }))
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

const newContextCreator = ({
  parameter,
  escape,
  mapInputKeys = snakeCase
}) => ({ params = [], parameterize = true } = {}) => {
  return { params, parameterize }
}

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
