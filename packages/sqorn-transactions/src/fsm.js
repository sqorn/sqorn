/** States */
const states = {
  /** new transaction object, no transaction client acquired */
  new: 'new',
  /** attempting to acquire transaction object */
  acquire_pending: 'acquire_pending',
  /** failed to acquire transaction client */
  acquire_failed: 'acquire_failed',
  /** transaction client available */
  ready: 'ready',
  /** query in progress */
  query_pending: 'query_pending',
  /** query was attempted and failed, */
  query_failed: 'query_failed',
  /** query was executed and trx.commit() called */
  to_commit: 'to_commit',
  /** query was executed and either trx.commit() or trx.rollback() called */
  to_rollback: 'to_rollback',
  /** no query executed and either trx.commit() or trx.rollback() called */
  to_optimize: 'to_optimize',
  /** trx.end() called */
  done: 'done',
  /** undefined transition, error state */
  error: 'error'
}

/** Actions */
const actions = {
  /** begin acquiring transaction client */
  acquire_begin: 'acquire_begin',
  /** succeed acquiring transaction client */
  acquire_succeeed: 'acquire_succeeed',
  /** fail acquiring transaction client */
  acquire_fail: 'acquire_fail',
  /** begin executing query */
  query_begin: 'query_begin',
  /** succeed executing query */
  query_succeed: 'query_succeed',
  /** fail executing query */
  query_fail: 'query_fail',
  /** call trx.commit() */
  commit: 'commit',
  /** call trx.rollback() */
  rollback: 'rollback',
  /** call trx.end() */
  end: 'end', //
  /** Kill pending queries */
  kill: 'kill'
}

const s = states
const a = actions
/** State transition table */
const transitions = {
  [s.new]: {
    [a.query_begin]: s.query_pending,
    [a.commit]: s.to_optimize,
    [a.rollback]: s.to_optimize,
    [a.acquire_begin]: s.acquire_pending
  },
  [s.acquire_pending]: {
    [a.acquire_fail]: s.acquire_failed,
    [a.acquire_succeeed]: s.ready
  },
  [s.acquire_failed]: {
    [a.commit]: s.to_optimize,
    [a.rollback]: s.to_optimize
  },
  [s.query_pending]: {
    [a.query_succeed]: s.ready,
    [a.query_fail]: s.query_failed
  },
  [s.ready]: {
    [a.query_begin]: s.query_pending,
    [a.commit]: s.to_commit,
    [a.rollback]: s.to_rollback
  },
  [s.query_failed]: {
    [a.commit]: s.to_rollback,
    [a.rollback]: s.to_rollback
  },
  [s.to_commit]: {
    // should block query_begin event
  },
  [s.to_rollback]: {
    // should block query_begin event
  },
  [s.to_optimize]: {
    // should block query_begin event
  },
  [s.done]: {},
  [s.error]: {}
}

// add error transitions
for (const state in states) {
  transitions[state] = transitions[state] || {}
  for (const action in actions) {
    transitions[state][action] = transitions[state][action] || s.error
  }
}

module.exports = { states, actions, transitions }
