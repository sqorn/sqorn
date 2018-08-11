const Benchmark = require('benchmark')
const sq = require('../src')()

const compare = (...queries) => {
  const suite = new Benchmark.Suite()
  queries.forEach(({ name, qry }) => {
    suite.add(name, function() {
      qry.qry
    })
  })
  suite
    .on('cycle', function(event) {
      console.log(String(event.target))
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    .run({ async: true })
}

compare(
  {
    name: 'sq.l`select * from book where id = 7`',
    qry: sq.l`select * from book where id = 7`
  },
  {
    name: 'sq.frm`book`.whr`id = 7`',
    qry: sq.frm`book`.whr`id = 7`
  },
  {
    name: 'sq`book``id = 7`',
    qry: sq`book``id = 7`
  }
)
