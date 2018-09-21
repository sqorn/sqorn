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
  for (const method of methods) {
    const { name, updateContext, properties = {} } = method
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

  const builder = {
    // create new query builder
    create(method) {
      const fn = (...args) =>
        fn.create({ name: 'express', args, prev: fn.method })
      fn.method = method
      Object.setPrototypeOf(fn, builder)
      return fn
    },
    // close connection
    async end() {
      return client.end()
    },
    // compilation methods
    bld(inheritedContext) {
      const ctx = context(this.method, newContext(inheritedContext))
      return queries[ctx.type](ctx)
    },
    get query() {
      return this.bld()
    },
    // execution methods
    async one(trx) {
      const rows = await client.query(this.query, trx)
      return rows[0]
    },
    async all(trx) {
      return client.query(this.query, trx)
    },
    then(resolve) {
      resolve(this.all())
    },
    // transaction execution
    transaction(fn) {
      return fn ? client.transactionCallback(fn) : client.transactionObject()
    },
    // extends
    extend(...args) {
      return this.create({ name: 'extend', args, prev: this.method })
    }
  }

  // add query building methods
  for (const method of methods) {
    const { getter, name, properties } = method
    if (getter) {
      // add getter methods
      Object.defineProperty(builder, name, {
        get: function() {
          return this.create({ name, prev: this.method })
        }
      })
    } else if (properties) {
      // certain builder methods are both callable and have subproperties
      // e.g. .union() and .union.all()
      const subBuilderPrototype = {}
      for (const key in properties) {
        subBuilderPrototype[key] = function(...args) {
          return builder.create({
            name: `${name}.${key}`,
            args,
            prev: this.method
          })
        }
      }
      const subBuilder = function() {
        let fn = (...args) => this.create({ name, args, prev: this.method })
        fn.method = this.method
        Object.setPrototypeOf(fn, subBuilderPrototype)
        return fn
      }
      Object.defineProperty(builder, name, {
        get: subBuilder
      })
    } else {
      // add function call methods
      builder[name] = function(...args) {
        return this.create({ name, args, prev: this.method })
      }
    }
  }

  return builder.create()
}
