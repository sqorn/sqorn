const Benchmark = require('benchmark')

const mapJoin = (callbackfn, separator) => args => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += separator
    txt += callbackfn(args[i])
  }
  return txt
}

const cb = args => {
  return args[0]
}

const nonClosure = args => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ', '
    txt += cb(args[i])
  }
  return txt
}

const closure = mapJoin(cb, ', ')

new Benchmark.Suite('closure')
  .add('non-closure', function() {
    return nonClosure(['hi', 'bye', 'yay'])
  })
  .add('closure', function() {
    return closure(['hi', 'bye', 'yay'])
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
