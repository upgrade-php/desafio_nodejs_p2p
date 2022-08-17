const { Account, AccountState } = require('../entity/Account')
const factory = require('../factory/account')
const ObjectId = require('mongodb').ObjectId

class AbstractRepository {
  constructor(db, repository_name, logger) {
    this.db = db
    this.setNameCollection(repository_name)
    this.configureRepository()
    this.logger = logger
  }

  configureRepository() {
    this.repository = this.getCollection(this.collectionName)
  }

  setNameCollection(collection) {
    if (typeof collection == 'function') {
      this.collectionName = collection.name.toLowerCase()
    } else {
      this.collectionName = collection.toLowerCase()
    }
  }

  getCollection(name) {
    return this.db.collection(name)
  }

  async save(entity) {
    const data = await entity.toJson()
    this.logger.log('DOCUMENT DATA', data)

    if (!data['_id']) {
      let document = await this.repository.insertOne(
        Object.assign({}, data, { created_at: new Date() })
      )
      this.logger.log('DOCUMENT INSERTED', document)
      return document
    }

    const data2 = Object.assign({}, data, { updated_at: new Date() })
    let document = await this.repository.updateOne(
      { _id: data2['_id'] },
      { $set: data2 }
    )
    this.logger.log('DOCUMENT UPDATED', document)

    return document
  }
}

class AccountRepository extends AbstractRepository {
  constructor(db, logger) {
    super(db, Account, logger)
  }

  async findAll() {
    return await this.repository.find().toArray()
  }

  async findById(id) {
    return await this.findOneBy({ _id: new ObjectId(id) })
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

  async findOneBy(where) {
    this.logger.log('QUERY:', where)
    const rs = await this.repository.findOne(where)
    this.logger.log('QUERY RESULT', rs)
    if (!rs) {
      return null
    }
    return factory.loadFromDb(rs)
  }

  async count() {
    return await this.repository.countDocuments()
  }

  async create(name, phone, email, cpf_cnpj, password) {
    const account = factory.createAccount({
      person: { name: name, phone: phone, email: email, cpf_cnpj: cpf_cnpj },
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
