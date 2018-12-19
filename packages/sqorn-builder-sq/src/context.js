/** Returns a function the creates a new context */
const createNewContext = defaultContext => {
  const { parameter, escape, mapKey, build } = defaultContext

  return (inherit = {}) => {
    const { params = [], parameterize = true } = inherit

    const whr = []
    return {
      // properties set by the sqorn instance
      parameter,
      escape,
      mapKey,
      build,

      // properties inherited from the parent query
      params,
      parameterize,
      parameter: parameterize ? parameter : escape,

      // properties of the current query
      type: 'select',
      // | sql' | 'select' | 'delete' | 'insert' | 'update'
      target: whr,
      // associates condition with previous calls to .where, .join.on, and .having
      nextJoin: { join: 'inner' },
      join: undefined,
      separator: ' ',
      sql: [],
      ret: [],
      frm: [],
      whr,
      grp: [],
      hav: [],
      setop: [],
      ord: [],
      with: [],
      set: []

      // properties that may be added dynamically:
      // userType
      // distinct
    }
  }
}

module.exports = createNewContext
