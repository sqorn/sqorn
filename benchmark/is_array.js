const Benchmark = require('benchmark')

new Benchmark.Suite('is_array')
  .add('Array.isArray', function() {
    return Array.isArray([])
  })
  .add('constructor.prototype === Array.prototype', function() {
    return [].constructor.prototype === Array.prototype
  })
  .add('instanceof Array', function() {
    return [] instanceof Array
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
