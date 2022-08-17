const TransactionFactory = require('../factory/transaction')

class TransactionService {
  constructor({ uow }) {
    this.uow = uow
  }

  async transfer(sourceAccountNumber, targetAccountNumber, value) {
    try {
      await this.uow.start()
      await this.uow.accountService.debit(sourceAccountNumber, value)
      await this.uow.accountService.deposite(targetAccountNumber, value)

      let sourceAccount =
        await this.uow.accountService.getActiveAccountByAccountNumber(
          sourceAccountNumber
        )
      let targetAccount =
        await this.uow.accountService.getActiveAccountByAccountNumber(
          targetAccountNumber
        )
      let transaction = TransactionFactory.create(
        sourceAccount,
        targetAccount,
        value
      )

      const rs = await this.uow.transactionRepository.create(transaction)
      await this.uow.commit()

      return rs
    } catch (error) {
      await this.uow.abort()
      throw error
    }
  }
}

module.exports = TransactionService
