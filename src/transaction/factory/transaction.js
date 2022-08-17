const Account = require('../entity/Account')
const { Transaction } = require('../entity/Transaction')

class TransactionFactory {
  static create(sourceAccount, targetAccount, value) {
    return new Transaction({
      from: new Account({
        account_number: sourceAccount.account_number,
        person_name: sourceAccount.person.name,
        cpf_cnpj: sourceAccount.person.cpf_cnpj,
      }),
      to: new Account({
        account_number: targetAccount.account_number,
        person_name: targetAccount.person.name,
        cpf_cnpj: targetAccount.person.cpf_cnpj,
      }),
      value: value,
    })
  }

  static loadFromDb(data) {
    return new Transaction({
      _id: data._id,
      from: new Account(data.from),
      to: new Account(data.to),
      value: data.value,
      status: data.status,
      created_at: data.created_at,
    })
  }
}

module.exports = TransactionFactory
