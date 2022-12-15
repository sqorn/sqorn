const db_name = 'sqorn_pg_test'
const uri = process.env.POSTGRES_URL ?? `postgres://postgres@localhost:5432`

module.exports = {
  db_name,
  adminConnection: {
    connectionString: `${uri}/postgres`,
    connectionTimeoutMillis: 1000
  },
  connection: {
    connectionString: `${uri}/${db_name}`,
    connectionTimeoutMillis: 1000
  }
}

console.log(module.exports)
