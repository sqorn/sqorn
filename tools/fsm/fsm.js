const fs = require('fs')
const Viz = require('viz.js')
const { Module, render } = require('viz.js/full.render.js')

const parseCSV = csv => {
  if (csv.length === 0) throw Error('Empty CSV')
  const [first, ...rest] = csv.split('\n')
  const [placeholder, ...states] = first.split(',')
  let transitions = []
  rest.forEach(line => {
    const [action, ...nextStates] = line.split(',')
    for (let i = 0; i < states.length; ++i) {
      const source = states[i]
      const destination = nextStates[i]
      if (destination !== '') {
        transitions.push({
          source,
          destination,
          action
        })
      }
    }
  })
  return { start: states[0], transitions }
}

const graphViz = ({ start, transitions }) => {
  return `digraph finite_state_machine {
    rankdir=LR;
    size="8,5"
    node [fixedsize = true];
    node [width = 2]
    node [shape = box];
    // node [shape = box]; S;
    i -> ${start};
    ${transitions.map(transition).join('\n    ')}
  }`
}

// const transition = ({ source, destination, action }) =>
//   `${source} -> ${destination} [ label = <<font color="blue">${action}</font>> ];`

// const dagre = ({ start, transitions }) => {
//   return `digraph finite_state_machine {
//     rankdir=LR;
//     size="8,5"
//     // node [fixedsize = true];
//     // node [width = 2]
//     // node [shape = box];
//     // node [shape = box]; S;
//     i -> ${start};
//     ${transitions.map(dagreTransition).join('\n    ')}
//   }`
// }

// const dagreTransition = ({ source, destination, action }) =>
//   `${source} -> ${destination} [ label = "${action}" ];`

async function main() {
  const csv = fs.readFileSync('fsm.csv', { encoding: 'utf8' })
  const dot = graphViz(parseCSV(csv))
  fs.writeFileSync('fsm.dot', dot)
  const viz = new Viz({ Module, render })
  const svg = await viz.renderString(dot)
  fs.writeFileSync('fsm.svg', svg)
}

main()
