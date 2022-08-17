class AccountService {
  constructor(repository) {
    this._repository = repository
  }

  async findPersonByCpfOrCnpj(cpf_cnpj) {
    return await this._repository.findPersonByCpfCnpj(cpf_cnpj)
  }

  async getActiveAccountByAccountNumber(account_number) {
    return await this._repository.getActiveAccountByAccountNumber(
      account_number
    )
  }

  async deposite(account_number, value) {
    return await this._repository.deposite(account_number, value)
  }

  async debit(account_number, value) {
    return await this._repository.debit(account_number, value)
  }
}

module.exports = AccountService
