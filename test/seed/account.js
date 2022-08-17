const faker = require('faker-br')
faker.locale = 'pt_BR'

class AccountSeed {
  constructor(repository) {
    this._repository = repository
  }

  async createAccount() {
    let rs = await this._repository.create(
      faker.name.firstName() + ' ' + faker.name.lastName(),
      faker.phone.phoneNumber('8598#######'),
      faker.internet.email(),
      faker.br.cpf(),
      faker.internet.password()
    )

    return await this._repository.findById(rs.insertedId.toString())
  }

  async createAccountActive(data) {
    let ac1 = await this.createAccount()
    await this._repository.active(ac1.id)

    if (data && 'deposite' in data) {
      await this._repository.deposite(ac1.account_number, data['deposite'])
    }

    return await this._repository.findById(ac1.id)
  }
}

module.exports = AccountSeed
