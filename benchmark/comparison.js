const Benchmark = require('benchmark')
const knex = require('knex')({ client: 'pg' })
const squel = require('squel').useFlavour('postgres')
const sq = require('../src')()

const suite = new Benchmark.Suite()

// add tests
suite
  .add('Knex 1 ', function() {
    knex
      .from('books')
      .select('title', 'author', 'year')
      .whereRaw('author = ?', ['Jo'])
      .toSQL()
  })
  .add('Knex 2 ', function() {
    knex
      .from('books')
      .select('title', 'author', 'year')
      .where({ author: 'Joe' })
      .toSQL()
  })
  .add('Squel  ', function() {
    squel
      .select()
      .from('books')
      .where('author = ?', 'Jo')
      .fields(['title', 'author', 'year'])
      .toParam()
  })
  .add('Sqorn 1', function() {
    sq.from`books`.where`author = ${'Jo'}`.return`title, author, year`.query
  })
  .add('Sqorn 2', function() {
    sq`books``author = ${'Jo'}``title, author, year`.query
  })
  .add('Sqorn 3', function() {
    sq.from('books').where`author = ${'Jo'}`.return(
      'title',
      'author',
      'year'
    ).query
  })
  .add('Sqorn 4', function() {
    sq`books`({ author: 'Joe' })`title, author, year`.query
  })
  .add('Sqorn 5', function() {
    sq.extend(
      sq.from`books`,
      sq.where`author = ${'Jo'}`,
      sq.return`title, author, year`
    ).query
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
