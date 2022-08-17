const state_registered = 'registered'

class TransactionState {
  static stateRegistered() {
    return state_registered
  }
}

class Transaction {
  constructor({ _id, from, to, value, status, created_at }) {
    this._id = _id
    this.setSourcetAccount(from)
    this.setTargetAccount(to)
    this.setValue(value)
    this._status = status
    this._created_at = created_at
  }

  setTargetAccount(account) {
    if (account.equals(this._from)) {
      throw new Error('The target account needed be different the of source')
    }

    this._to = account
  }

  setSourcetAccount(account) {
    this._from = account
  }

  setStatus(status) {
    this._status = status
  }

  setValue(value) {
    if (!value || value < 0) {
      throw new Error('The value is invalid')
    }

    this._value = parseFloat(value)
  }

  get value() {
    return this._value
  }

  toJson() {
    return {
      _id: this._id,
      from: this._from.toJson(),
      to: this._to.toJson(),
      value: this._value,
      status: this._status,
      created_at: this._created_at,
    }
  }
}

module.exports = {
  Transaction: Transaction,
  TransactionState: TransactionState,
}
