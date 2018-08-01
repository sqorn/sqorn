module.exports = class {
  constructor() {}
  async query({ txt, arg }, trx) {
    throw Error(`Cannot query with 'none' client`)
  }
  async transaction(fn) {
    throw Error(`Cannot run transaction with 'none' client`)
  }
}
