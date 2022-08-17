class UnitOfWork {
  constructor({ session, accountService, transactionRepository }) {
    this._session = session
    this.accountService = accountService
    this.transactionRepository = transactionRepository
  }

  async start() {
    await this._session.startTransaction(this.transactionOption)
  }

  async commit() {
    await this._session.commitTransaction()
  }

  async abort() {
    await this._session.abortTransaction()
  }

  get transactionOption() {
    return {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    }
  }
}

module.exports = UnitOfWork
