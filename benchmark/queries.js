const Benchmark = require('benchmark')
const sq = require('../packages/sqorn-pg')()

console.log(
  sq
    .from(sq.txt`book`)
    .where({ author: sq.txt`author = ${'Jo'}` })
    .return(sq.return`1`, 'author', 'year').query
)

new Benchmark.Suite()
  .add('sqorn complex', function() {
    sq
      .from(sq.txt`book`)
      .where({ author: sq.txt`author = ${'Jo'}` })
      .return(sq.return`1`, 'author', 'year').query
  })
  // .add('sqorn select', function() {
  //   sq
  //     .from('book')
  //     .where({ author: 'Joe' })
  //     .return('title', 'author', 'year').query
  // })
  // .add('sqorn insert', function() {
  //   sq.from('book').insert({ title: 'hi', year: 1991, author: 'Joe' }).query
  // })
  // .add('sqorn update', function() {
  //   sq
  //     .from('book')
  //     .set({ title: 'hi' })
  //     .where({ id: 23 }).query
  // })
  // .add('sqorn delete', function() {
  //   sq.from`books`.where`author = Joe`.delete.query
  // })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
