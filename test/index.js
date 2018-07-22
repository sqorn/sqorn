const literalLiteral = (strings, args) => {
  let result = strings[0]
  for (let i = 0; i < args.length; i++) {
    result += '${' + args[i] + '}' + strings[i + 1]
  }
  return '`' + result + '`'
}

const printNone = () => () => {}

const printFirst = (strings, ...args) => {
  console.log(joinLiteral(strings, args))
  return () => {}
}

const printSecond = () => (strings, ...args) => {
  console.log(joinLiteral(strings, args))
}

const printBoth = (strings, ...args) => {
  console.log(joinLiteral(strings, args))
  return (strings, ...args) => {
    console.log(joinLiteral(strings, args))
  }
}

printNone`first``second`
printFirst`first``second`
printSecond`first``second`
printBoth`first``second`

const printParts = (strings, ...args) => {
  console.group('input    ', literalLiteral(strings, args))
  console.log('result ', joinLiteral(strings, args))
  console.log('strings', strings)
  console.log('args   ', args)
  console.groupEnd()
  console.log()
}

printParts``
printParts`a`
printParts`ab`
printParts`${1}`
printParts`a${1}`
printParts`${1}b`
printParts`a${1}b`
printParts`a${1}b`
printParts`${1}${2}`
printParts`${1}c${2}`
