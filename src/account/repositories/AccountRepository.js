const AbstractRepository = require('../../base/AbastractRespository')
const { Account, AccountState } = require('../entity/Account')

class AccountRepository extends AbstractRepository {
  constructor(db, session, logger) {
    super(db, Account, logger, session)
  }

  async findAll() {
    return await this.repository.find().toArray()
  }

  async findPersonByCpfCnpj(cpf_cnpj) {
    return await this.findOneBy({ 'person.cpf_cnpj': cpf_cnpj })
  }

  async findByAccountNumber(account_number) {
    return await this.findOneBy({ account_number: account_number })
  }

  async findActive(cpf_cnpj) {
    return await this.findOneBy({
      account_number: cpf_cnpj,
      status: AccountState.active,
    })
  }

  async getActiveAccountByAccountNumber(account_number) {
    return await this.findOneBy({
      account_number: account_number,
      status: AccountState.active,
    })
  }

  async count() {
    return await this.repository.countDocuments()
  }

  async create(name, phone, email, cpf_cnpj, password) {
    const check = await this.repository
      .find({
        $or: [{ 'person.cpf_cnpj': cpf_cnpj }, { 'person.email': email }],
      })
      .count()
    if (check) {
      throw new Error('Reported data already exists in our database')
    }

    const account = this.factory.createAccount({
      person: {
        name: name,
        phone: phone,
        email: email,
        cpf_cnpj: cpf_cnpj,
      },
      password: password,
    })

    return await this.save(account)
  }

  async deposite(account_number, value) {
    const account = await this.findActive(account_number)
    if (!account) {
      throw new Error('Account number not exist:', account)
    }

    account.addBalance(value)
    return await this.save(account)
  }

  async debit(account_number, value) {
    const account = await this.findActive(account_number)
    if (!account) {
      throw new Error('Account number not exist:', account)
    }

    account.debit(value)
    return await this.save(account)
  }

  async active(id) {
    const account = await this.findById(id)
    if (account && account.status == AccountState.pending) {
      account.status = AccountState.active
      return await this.save(account)
    }
  }
}

module.exports = AccountRepository
