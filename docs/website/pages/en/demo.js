const React = require('react')
// const MonacoEditor = require('react-monaco-editor')

const App = () => null

// class App extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       code: '// type your code...'
//     }
//   }
//   editorDidMount = (editor, monaco) => {
//     console.log('editorDidMount', editor)
//     editor.focus()
//   }
//   onChange = (newValue, e) => {
//     console.log('onChange', newValue, e)
//   }
//   render() {
//     const code = this.state.code
//     const options = {
//       selectOnLineNumbers: true
//     }
//     return (
//       <MonacoEditor
//         width="800"
//         height="600"
//         language="javascript"
//         theme="vs-dark"
//         value={code}
//         options={options}
//         onChange={this.onChange}
//         editorDidMount={this.editorDidMount}
//       />
//     )
//   }
// }

class Editor extends React.Component {
  render() {
    return (
      <textarea
        style={{
          flexGrow: 1,
          margin: '24px',
          height: '400px',
          fontSize: '1.3em'
        }}
      />
    )
  }
}

class Demo extends React.Component {
  render() {
    return (
      <div>
        <h1>demo</h1>
        <div style={{ display: 'flex' }}>
          <Editor />
          <Editor />
        </div>
      </div>
    )
  }
}

module.exports = Demo
