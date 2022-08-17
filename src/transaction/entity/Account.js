class Account {
  constructor({ account_number, person_name, cpf_cnpj }) {
    this.setAccountNumber(account_number)
    this._person_name = person_name
    this._cpf_cnpj = cpf_cnpj
  }

  _validateAccount(account_number) {
    if (!account_number || account_number.length < 8) {
      return false
    }
    var number_init = account_number
      .substring(0, 6)
      .split('')
      .map((str) => {
        return Number(str)
      })
      .reduce((a, b) => a + b, 0)

    var digit = parseInt(account_number.substring(6, 8))

    return digit == number_init
  }

  setAccountNumber(account_number) {
    if (!this._validateAccount(account_number)) {
      throw new Error('The account number is invalid')
    }

    this._account_number = account_number
  }

  maskCpfCnpj() {
    if (this._cpf_cnpj.length == 11) {
      return '***.***.' + this._cpf_cnpj.substr(5, 3) + '-**'
    }
    return this._cpf_cnpj
  }

  getAccountNumber() {
    return this._account_number
  }

  equals(account) {
    return this.getAccountNumber() === account.getAccountNumber()
  }

  toJson() {
    return {
      account_number: this._account_number,
      person_name: this._person_name,
      cpf_cnpj: this.maskCpfCnpj(),
    }
  }
}

module.exports = Account
