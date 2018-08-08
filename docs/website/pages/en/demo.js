const React = require('react')

const preamble = `
  const sqorn = require('sqorn')
  const sq = sqorn()
`

const source = `const kid = sq.frm\\\`person\\\`.whr\\\`age < ${13}\\\`
const boy = kid.whr\\\`gender = 'male'\\\`

boy.ret\\\`id, name, age\\\`.qry
`

const createRunkitEmbed = `
var notebook = RunKit.createNotebook({
  element: document.getElementById("runkit"),
  source: \`${source}\`,
  preamble: \`${preamble}\`,
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
