module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: './sqorn.web.js'
  },
  externals: {
    pg: 'pg'
  },
  mode: 'production'
}
