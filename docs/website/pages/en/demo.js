const React = require('react')

const source = `const sq = require('sqorn-pg')()

const kid = sq.from\\\`person\\\`.where\\\`age < ${13}\\\`
const boy = kid.where\\\`gender = 'male'\\\`

boy.return\\\`id, name, age\\\`.query
`

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
