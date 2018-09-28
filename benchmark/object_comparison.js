const Benchmark = require('benchmark')

const a = {},
  b = {}
a.x = b.x = []

new Benchmark.Suite('last_string_index', {
  onStart: () => {
    str = Math.floor(Math.random() * 1000).toString(10)
  }
})
  .add('a', function() {
    return a.x === b.x
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
