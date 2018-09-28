module.exports = ({ database, dialect }) => (config = {}) => {
  const { methods, newContext, queries } = dialect

  const contextUpdaters = {}
  // create context object ctx by processing methods linked list
  const context = (method, ctx) => {
    // follow method links to construct methods array (in reverse)
    const methods = []
    for (; method !== undefined; method = method.prev) {
      methods.push(method)
    }
    // build methods object by processing methods in call order
    for (let i = methods.length - 1; i >= 0; --i) {
      const method = methods[i]
      contextUpdaters[method.name](ctx, method.args)
    }
    return ctx
  }
  // setup context update functions
  for (const name in methods) {
    const { updateContext, properties = {} } = methods[name]
    contextUpdaters[name] = updateContext
    for (const key in properties) {
      contextUpdaters[`${name}.${key}`] = properties[key]
    }
  }

  contextUpdaters.extend = (ctx, args) => {
    for (const builder of args) {
      context(builder.method, ctx)
    }
  }

  // connect to database
  const client = config.connection && database(config)

  const builder = {}
  const createBuilder = method => {
    const fn = (...args) =>
      createBuilder({ name: 'express', args, prev: method })
    fn.method = method
    Object.setPrototypeOf(fn, builder)
    return fn
  }
  const properties = {
    // close connection
    end: {
      value: async function() {
        return client.end()
      }
    },
    // compilation methods
    bld: {
      value: function(inheritedContext) {
        const ctx = context(this.method, newContext(inheritedContext))
        return queries[ctx.type](ctx)
      }
    },
    query: {
      get: function() {
        return this.bld()
      }
    },
    // execution methods
    one: {
      value: async function(trx) {
        const rows = await client.query(this.query, trx)
        return rows[0]
      }
    },
    all: {
      value: async function(trx) {
        return client.query(this.query, trx)
      }
    },
    then: {
      value: function(resolve) {
        resolve(this.all())
      }
    },
    transaction: {
      value: function(fn) {
        return fn ? client.transactionCallback(fn) : client.transactionObject()
      }
    },
    extend: {
      value: function(...args) {
        return createBuilder({ name: 'extend', args, prev: this.method })
      }
    }
  }

  // add query building methods
  for (const name in methods) {
    const { getter, properties: props } = methods[name]
    if (getter) {
      // add getter methods
      properties[name] = {
        get: function() {
          return createBuilder({ name, prev: this.method })
        }
      }
    } else if (props) {
      // certain builder methods are both callable and have subproperties
      // e.g. .union() and .union.all()
      const subBuilderPrototype = {}
      for (const key in props) {
        subBuilderPrototype[key] = function(...args) {
          return createBuilder({
            name: `${name}.${key}`,
            args,
            prev: this.method
          })
        }
      }
      const subBuilder = function() {
        let fn = (...args) => createBuilder({ name, args, prev: this.method })
        fn.method = this.method
        Object.setPrototypeOf(fn, subBuilderPrototype)
        return fn
      }
      properties[name] = {
        get: subBuilder
      }
    } else {
      // add function call methods
      properties[name] = {
        value: function(...args) {
          return createBuilder({ name, args, prev: this.method })
        }
      }
    }
  }

  Object.defineProperties(builder, properties)

  return createBuilder()
}
