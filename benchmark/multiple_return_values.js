const Benchmark = require('benchmark')

const obj = () => ({ x: 2, y: 3 })
const arr = () => [2, 3]

const robj = () => ({ x: Math.random(), y: Math.random() })
const rarr = () => [Math.random(), Math.random()]

new Benchmark.Suite('last_string_index', {
  onStart: () => {
    str = Math.floor(Math.random() * 1000).toString(10)
  }
})
  .add('obj', function() {
    const { x, y } = obj()
    return x + y
  })
  .add('arr', function() {
    const [x, y] = arr()
    return x + y
  })
  .add('robj', function() {
    const { x, y } = robj()
    return x + y
  })
  .add('rarr', function() {
    const [x, y] = rarr()
    return x + y
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
