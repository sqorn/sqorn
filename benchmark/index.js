const Benchmark = require('benchmark')
const sq = require('../src')()

new Benchmark.Suite()
  .add('sq.l', function() {
    sq.l`select * from book where id = 7`.qry
  })
  .add('sq', function() {
    sq.frm`book`.whr`id = 7`.qry
  })
  .add('express', function() {
    sq`book``id = 7`.qry
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
