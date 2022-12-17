require('dotenv').config()
const db_name = `sqorn_pg_test_${process.env.JEST_WORKER_ID}`

module.exports = {
  db_name,
  adminConnection: {
    database: 'postgres',
    connectionTimeoutMillis: 1000,
    ssl: false
  },
  connection: {
    database: db_name,
    connectionTimeoutMillis: 1000,
    ssl: false
  }
}
