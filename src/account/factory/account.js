const { AccountState, Account } = require('../entity/Account')
const Person = require('../entity/Person')

class AccountFactory {
  static createAccount(data) {
    const account = new Account({
      person: this.createPerson(data.person),
      password: data.password,
      balance: 0,
      status: AccountState.pending,
    })
    account.encryptPassword()
    account.generateAccountId()
    return account
  }

  static createPerson(data) {
    return new Person(data)
  }

  static loadFromDb(data) {
    return new Account({
      person: this.createPerson(data.person),
      password: data.password,
      _id: data._id,
      account_number: data.account_number,
      created_at: data.created_at,
      balance: data.balance,
      status: data.status,
    })
  }
}

module.exports = AccountFactory
