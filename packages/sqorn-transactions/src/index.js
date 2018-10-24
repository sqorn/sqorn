const { states, actions, transitions } = require('./fsm')
const TransactionQueue = require('./queue')

const transactionCreator = transactionClient => {
  class Transaction {
    constructor() {
      this.state = states.new
      this.client = undefined
      this.queue = new TransactionQueue()
    }
    async query(query) {
      if (this.state === states.new) await this._initializeTransaction()
      return this.queue.add(this._query(query))
    }
    commit() {
      this._nextState(actions.commit)
    }
    rollback() {
      this._nextState(actions.rollback)
    }
    async end() {
      try {
        // kill any pending transactions
        if (this.queue._kill())
          this._nextState(
            actions.kill,
            Error('Transaction ended while queries were pending')
          )

        switch (this.state) {
          case states.new:
          case states.to_optimize:
            this._nextState(actions.end)
            break
          case states.ready:
            if (didKill) {
              // TODO: consider adding state for pending queries
            }
            break
          case states.query_pending:
          case states.query_failed:
          case states.to_commit:
          case states.to_rollback:

          case states.ended:
          case states.acquire_pending:
          case states.acquire_failed:
          case states.error:
          default:
            throw Error()
        }
      } finally {
        this._nextState(actions.end)
      }
    }
    async _query(query) {
      try {
        this._nextState(actions.query_begin)
        const result = await this.client.query(query)
        this._nextState(actions.query_succeed)
        return result
      } catch (error) {
        this._nextState(actions.query_fail, error)
      }
    }
    /** Acquires transaction client and issues begin query */
    async _initializeTransaction() {
      try {
        this._nextState(actions.acquire_begin)
        this.client = await transactionClient()
        this._nextState(actions.acquire_succeeed)
      } catch (error) {
        this._nextState(actions.acquire_fail, error)
      }
      await this._query('begin')
    }
    _nextState(action, error) {
      const oldState = this.state
      this.state = transitions[this.state][action]
      if (error) throw error
      if (this.state === states.error)
        throw Error(
          `Invalid action '${action}' on transaction state '${oldState}'`
        )
      return this.state
    }
  }

  const transactionCallback = async callback => {
    const trx = new Transaction()
    try {
      await callback(trx)
    } catch (error) {
      trx.rollback()
      throw error
    } finally {
      await trx.end()
    }
  }

  return callback =>
    callback ? transactionCallback(callback) : new Transaction()
}

module.exports = transactionCreator
