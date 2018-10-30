export interface Extendable<T> {
  extend<U extends T | U extends never ? never : unknown>(query: U): T | U;
}

interface Transaction {
  /**
   * Commits the transaction
   *
   *
   */
  commit(): Promise<void>;

  /**
   * Rolls back the transaction
   */
  rollback(): Promise<void>;
}

export interface Buildable {
  /**
   * Compiles the query builder state to return the equivalent parameterized query
   *
   * @example
   * sq`book`({ id: 7 })`title`.query
   * { text: 'select title from book where id = $1', args: [7] }
   *
   * sq`book`.delete({ id: 7 })`title`.query
   * { text: 'delete from book where id = $1 returning title', args: [7] }
   */
  readonly query: { text: string; args: any[] };
}

export interface Utilities {
  /**
   * Closes database connection
   */
  end(): Promise<void>;

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
   * const id = await sq.transaction(async trx => {
   * 	const { id } = await Account.insert({ username: 'jo' }).one(trx)
   * 	await Auth.insert({ accountId: id, password: 'secret' }).all(trx)
   *  return id
   * })
   */
  transaction<T>(callback: (trx: Transaction) => Promise<T>): Promise<T>;

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
   * let trx
   * try {
   *   trx = await sq.transaction()
   *   const { id } = await Account.insert({ username: 'jo' }).one(trx)
   *   await Auth.insert({ accountId: id, password: 'secret' }).all(trx)
   *   await trx.commit()
   * } catch (error) {
   *   await trx.rollback()
   * }
   */
  transaction(): Promise<Transaction>;
}
