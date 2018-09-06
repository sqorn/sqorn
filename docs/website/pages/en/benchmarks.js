const React = require('react')

const source = `const Benchmark = require('benchmark')
const knex = require('knex')({ client: 'pg' })
const squel = require('squel').useFlavour('postgres')
const sq = require('sqorn')()

new Benchmark.Suite()
  .add('Sqorn - args', function() {
    sq.frm('books').whr({ author: 'Joe' }).ret('title', 'author', 'year').qry
  })
  .add('Knex', function() {
    knex.from('books').select('title', 'author', 'year').where({ author: 'Joe' }).toSQL()
  })
  .add('Squel', function() {
    squel.select().from('books').where('author = ?', 'Jo').fields(['title', 'author', 'year']).toParam()
  })
  .add('Sqorn - template string', function() {
    sq.frm\\\`books\\\`.whr\\\`author = ${'Joe'}\\\`.ret\\\`title, author, year\\\`.qry
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })`

const createRunkitEmbed = `
var notebook = RunKit.createNotebook({
  element: document.getElementById("runkit"),
  source: \`${source}\`,
  minHeight: '300px',
  onLoad: notebook => notebook.evaluate()
})
`

class Demo extends React.Component {
  render() {
    return (
      <div style={{ padding: '24px' }}>
        <script src="https://embed.runkit.com" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5vh'
          }}
        >
          <div id="runkit" style={{ width: '800px' }} />
        </div>
        <script dangerouslySetInnerHTML={{ __html: createRunkitEmbed }} />
      </div>
    )
  }
}

module.exports = Demo
