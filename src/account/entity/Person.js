const phoneValidator = require('telefone/parse')
const emailValidator = require('email-validator')
const brValidator = require('br-validations')
const CpfCnpjInvalid = require('./Exceptions')

class Person {
  constructor({ name, phone, email, cpf_cnpj }) {
    this.setName(name)
    this.setPhone(phone)
    this.setEmail(email)
    this.setCpfCnpj(cpf_cnpj)
  }

  setName(name) {
    if (!name || name.length < 3) {
      throw new Error('Name is not valid:' + name)
    }

    this.name = name
  }

  setPhone(phone) {
    phone = this._clearPhone(phone)
    if (!phoneValidator(phone)) {
      throw new Error('Phone is not valid: ' + phone)
    }
    this.phone = phone
  }

  _clearPhone(phone) {
    return phone.replace('+55')
  }

  setEmail(email) {
    if (!emailValidator.validate(email)) {
      throw new Error('Email is not valid: ' + email)
    }
    this.email = email
  }

  setCpfCnpj(cpf_cnpj) {
    if (!cpf_cnpj) {
      throw new CpfCnpjInvalid('cpf ou cnpj is not valid: ' + cpf_cnpj)
    }

    if (
      !brValidator.cpf.validate(cpf_cnpj) &&
      !brValidator.cnpj.validate(cpf_cnpj)
    ) {
      throw new CpfCnpjInvalid('cpf ou cnpj is not valid: ' + cpf_cnpj)
    }

    this.cpf_cnpj = cpf_cnpj
  }

  toJson() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      cpf_cnpj: this.cpf_cnpj,
    }
  }
}

module.exports = Person
