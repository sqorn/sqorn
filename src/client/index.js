const pg = require('./pg')
const none = require('./none')

const createClient = ({ client, connection } = {}) => {
  switch (client) {
    case 'none':
    case undefined:
      return new none(connection)
    case 'pg':
      return new pg(connection)
    default:
      throw Error('Unknown client type')
  }
}

module.exports = createClient
