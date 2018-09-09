const Benchmark = require('benchmark')

const double = s => s + s
const source = [
  '1234',
  'asdf',
  'sd',
  'asdfasdfasdfas',
  'asdf',
  's',
  'sd',
  'asdfasdfasdfas',
  'asdf',
  's'
]

new Benchmark.Suite()
  .add('a', function() {
    return source.map(s => double(s)).join(', ')
  })
  .add('b', function() {
    let txt = ''
    for (let i = 0; i < source.length; ++i) {
      txt += double(source[i]) + ', '
    }
    return txt.slice(0, -2)
  })
  .add('c', function() {
    if (source.length === 0) return ''
    let txt = double(source[0])
    for (let i = 1; i < source.length; ++i) {
      txt += ', ' + double(source[i])
    }
    return txt
  })
  .add('d', function() {
    let txt = ''
    for (let i = 0; i < source.length; ++i) {
      if (i !== 0) {
        txt += ', '
      }
      txt += double(source[i])
    }
    return txt
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
