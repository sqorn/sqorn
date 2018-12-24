type Row = { [field: string]: any }

export interface Executable {
  /**
   * Executes a query and returns a Promise for an array of result rows.
   * 
   * @example
```js
await sq.return('id', 'title').from('book').all()
// example result:
[ { id: 1, title: 'The Way of Kings' },
  { id: 2, title: 'Words of Radiance' },
  { id: 3, title: 'Oathbringer' } ]
```
   */
  all(trx?: Transaction): Promise<Row[]>

  /**
   * Executes a query and returns a Promise for the first result row.
   * 
   * If a query returns no rows, `.first` returns `undefined`.
   * 
   * If a query returns multiple rows, all but the first are disgarded.
   * 
   * @example
```js
const book = await sq
  .from('book')
  .where({ genre: 'fantasy' })
  .limit(1)
  .first()

if (book) {
  console.log(book.title)
} else { // book === undefined
  console.log('No fantasy book')
}
```
   */
  first(trx?: Transaction): Promise<Row | undefined>

  /**
   * Executes a query and returns a Promise for the first result row.
   * 
   * If a query returns no rows, `.one` throws an error.
   * 
   * If a query returns multiple rows, all but the first are disgarded.
   * 
   * @example
```js
try {
  const book = await sq.from('book').where({ id: 1 }).one()
} catch (error) {
  console.log('failed')
}
```
   */
  one(trx?: Transaction): Promise<Row>

  /**
   * Executes a query and returns a void Promise that resolves when it is done.
   * 
   * If a query returns rows, all are disgarded.
   * 
   * @example
```js
await sq.from('book').insert({ title: 'Oathbringer' }).run()
```
   */
  run(trx?: Transaction): Promise<void>
}

interface Transaction {
  /**
   * Commits the transaction
   */
  commit(): Promise<void>;

  /**
   * Rolls back the transaction
   */
  rollback(): Promise<void>;
}

interface TransactionMethods {
  /**
   * Creates a transaction
   * 
   * Pass an asynchronous callback containing queries that should be executed
   * in the context of the transaction. If an error is throw in `callback`,
   * the transaction is rolled back. Otherwise, the transaction is committed,
   * and the value returned by the callback is returned.
   * 
   * The callback's first argument `trx` must be passed to every query within
   * the transaction, or queries will not be part of the transaction.
   * 
   * @example
```js
const id = await sq.transaction(async trx => {
	const { id } = await sq.from('account').insert({ username: 'jo' }).one(trx)
	await sq.from('auth').insert({ accountId: id, password: 'secret' }).all(trx)
 return id
})
```
   */
  transaction<T>(callback: (trx: Transaction) => Promise<T>): Promise<T>

  /**
   * Creates a transaction
   * 
   * When called without arguments, `.transaction` returns a transaction
   * object `trx`. You MUST call `trx.commit()` or `trx.rollback()`.
   * 
   * This overload is less convenient but more flexible than the callback
   * transaction method.
   * 
   * @example
```js
let trx
try {
  trx = await sq.transaction()
  const { id } = await sq.from('account').insert({ username: 'jo' }).one(trx)
  await sq.from('auth').insert({ accountId: id, password: 'secret' }).all(trx)
  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```
   */
  transaction(): Promise<Transaction>
}