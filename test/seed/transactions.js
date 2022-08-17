const faker = require('faker-br')
faker.locale = 'pt_BR'

class TransactionSeed {
  constructor(repository) {
    this._account = repository
  }

  async startCase(){
    const c1 = await this._account.createAccountActive({ deposite: 10.0 })
    const c2 = await this._account.createAccountActive()

    return {
        'conta1':c1, 
        'conta2':c2
    }
  }

}

module.exports = TransactionSeed
