// parameterizes given argument, function should be attached to ctx
function parameterize(arg) {
  if (arg === undefined) throw Error('Error: parameter is undefined')
  return `$${this.params.push(arg)}`
}

/** Escapes an argument for use in UNPARAMETERIZED queries. NOT SAFE AT ALL. */
const escape = arg => {
  if (arg === undefined) throw Error('Error: parameter is undefined')
  if (arg === null) return 'null'
  if (typeof arg === 'string') return escapeLiteral(arg)
  if (
    typeof arg === 'number' ||
    typeof arg == 'bigint' ||
    typeof arg == 'boolean'
  )
    return '' + arg
  if (typeof arg === 'object') {
    if (Array.isArray(arg)) {
      return `array[${arg.map(e => escape(e)).join(', ')}]`
    } else {
      return escapeLiteral(JSON.stringify(arg))
    }
  }
  throw Error(`Invalid argument SQL argument of type '${typeof arg}'`, arg)
}

// from https://github.com/brianc/node-postgres/blob/eb076db5d47a29c19d3212feac26cd7b6d257a95/lib/client.js#L351
const escapeLiteral = str => {
  let hasBackslash = false
  let escaped = "'"
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (c === "'") {
      escaped += c + c
    } else if (c === '\\') {
      escaped += c + c
      hasBackslash = true
    } else {
      escaped += c
    }
  }
  escaped += "'"
  if (hasBackslash === true) {
    escaped = ' E' + escaped
  }
  return escaped
}

module.exports = {
  parameterize,
  escape
}
