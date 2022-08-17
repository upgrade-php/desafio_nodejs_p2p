const bcrypt = require('bcrypt')

const state_peding = 'pending'
const state_active = 'active'
const state_refused = 'refused'
const state_error = 'error'

class AccountState {
  static get pending() {
    return state_peding
  }

  static get active() {
    return state_active
  }

  static get refused() {
    return state_refused
  }

  static get error() {
    return state_error
  }
}

class Account {
  constructor({
    _id,
    person,
    password,
    account_number,
    created_at,
    balance,
    status,
    updated_at,
  }) {
    this.saltRounds = 10
    ;(this.person = person), this.setPassword(password)
    this.account_number = account_number
    this.created_at = created_at
    this._balance = parseFloat(balance)
    this._id = _id
    this.status = status
    this.updated_at = updated_at
  }

  async setPassword(password) {
    if (!password || password.length < 4) {
      throw new Error('minimum size allowed is 4')
    }
    this.password = password
  }

  generateAccountId() {
    if (this.accout_number) return

    const st1 = [
      parseInt(this.person.phone.substring(0, 1)),
      parseInt(this.person.phone.substring(1, 2)),
      parseInt(this.person.cpf_cnpj.substring(2, 3)),
      parseInt(this.person.cpf_cnpj.substring(3, 4)),
      this.getRandomArbitrary(1, 9),
      this.getRandomArbitrary(1, 9),
    ]
    const rs = st1.reduce((a, b) => a + b, 0)
    st1[6] = rs
    this.account_number = st1.join('')
  }

  getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  getPassword() {
    return this.password
  }

  addBalance(balance) {
    if(isNaN(balance)){
      throw new Error('Value is not valid')
    }
    this._balance += balance
  }

  debit(value) {
    if (value > this._balance) {
      throw new Error('There is not enough balance to carry out the operation')
    }
    this._balance -= value
  }

  getBalance() {
    return this._balance
  }

  encryptPassword() {
    this.password = bcrypt.hashSync(this.password, this.saltRounds)
  }

  get id() {
    return this._id.toString()
  }

  toJson(hide = false) {
    const content = {
      account_number: this.account_number,
      person: this.person.toJson(),
      balance: this._balance,
      created_at: this.created_at,
      updated_at: this.updated_at,
      _id: this._id,
      status: this.status,
    }

    if (!hide) {
      content.password = this.password
    }

    return content
  }
}

module.exports = {
  Account: Account,
  AccountState: AccountState,
}
