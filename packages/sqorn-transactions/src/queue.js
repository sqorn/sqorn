module.exports = class TransactionQueue {
  /** Constructs a new Promise Queue.
   * At most one promise is executed at a time in FIFO order.
   * This queue ensures at most one query is executed at a time in a transaction.
   * If any promise fails, all pending and new promises are rejected
   */
  constructor() {
    this.dead = false
    this.active = undefined
    this.last = undefined
  }
  isEmpty() {
    return this.active === undefined
  }
  /** Add a promise to the queue and returns its resolved value */
  add(promise) {
    return new Promise((resolve, reject) => {
      if (this.dead) {
        reject(Error('Transaction failed. Cannot execute new query.'))
      } else {
        const node = { promise, resolve, reject, next: undefined }
        if (this.active) {
          this.last = this.last.next = node
        } else {
          this.active = this.last = node
          this._execute()
        }
      }
    })
  }
  /** Run Promise, on success trigger next, on failure kill promise queue */
  _execute() {
    const { promise, resolve, reject } = this.active
    promise
      .then(value => {
        resolve(value)
        this._next()
      })
      .catch(error => {
        reject(error)
        this._kill()
      })
  }
  /** Trigger next promise if any */
  _next() {
    if (this.active === this.last) {
      this.active = this.last = undefined
    } else {
      this.active = this.active.next
      this._execute()
    }
  }
  /** Reject all pending and any future promises
   * Returns whether any pending promise was killed
   */
  _kill() {
    let killed = false
    for (let node = this.active; node; node = node.next) {
      node.reject(Error('Transaction failed. Cannot execute pending query'))
      killed = true
    }
    this.active = this.last = undefined
    this.dead = true
    return killed
  }
}
