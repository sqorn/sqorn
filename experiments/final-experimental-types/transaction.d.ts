export interface Transaction {
  /**
   * Commits the transaction
   */
  commit(): Promise<void>;

  /**
   * Rolls back the transaction
   */
  rollback(): Promise<void>;
}
