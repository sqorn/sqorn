const Benchmark = require('benchmark')

let str = ''

new Benchmark.Suite('last_string_index', {
  onStart: () => {
    str = Math.floor(Math.random() * 1000).toString(10)
  }
})
  .add('a', function() {
    return str.endsWith('$')
  })
  .add('b', function() {
    return str.slice(-1) === '$'
  })
  .add('c', function() {
    return str[str.length - 1] === '$'
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
