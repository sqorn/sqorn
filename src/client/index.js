const pg = require('./pg')
const none = require('./none')

const createClient = (config = {}) => {
  if (config.pg) {
    return new pg(config.pg)
  }
  return new none()
}

module.exports = createClient
