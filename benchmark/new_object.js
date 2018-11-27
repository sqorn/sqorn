const Benchmark = require('benchmark')


class Meow {
  constructor()
  meow() { console.log('meow') }
}

const chain = method => {
  const fn = (...args) => chain({ name: 'express', args, prev: method })
  fn.method = method
  Object.setPrototypeOf(fn, prototype)
  return fn
}

new Benchmark.Suite('last_string_index', {})
  .add('{}}', function() {
    const a = {}
    const b = {}
    const c = {}
    const d = {}
    const e = {}
  })
  .on('new Object()', function(event) {
    const a = new Object()
    const b = new Object()
    const c = new Object()
    const d = new Object()
    const e = new Object()
  })
  .on('new fn', function(event) {
    
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
