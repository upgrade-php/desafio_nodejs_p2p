const { MongoClient } = require('mongodb')
const { settings } = require('./settings')
const { Console } = require('console')
const fs = require('fs')
const AccountRepository = require('../src/account/repositories/AccountRepository')
const AccountService = require('../src/account/service-layer/service')
const TransactionService = require('../src/transaction/service-layer/service')
const TransactionRespository = require('../src/transaction/repositories/transaction')
const UnitOfWork = require('../src/transaction/service-layer/unitofwork')

client = new MongoClient(settings.mongodb)

module.exports = {
  db_client: async () => {
    return await client.connect()
  },
  db_session: async (container) => {
    const db_client = await container.get('db_client')
    return db_client.startSession()
  },
  db_factory: async (container) => {
    try {
      const client = await container.get('db_client')
      return client.db(settings.db_name)
    } catch (e) {
      console.error(e)
    }
  },
  Console: () => {
    return new Console({
      stdout: fs.createWriteStream('logs/app.log', {
        flags: 'a',
      }),
      stderr: fs.createWriteStream('logs/error.log', {
        flags: 'a',
      }),
    })
  },
  AccountRepository: async (container) => {
    const db = await container.get('db_factory')
    const console = container.get('Console')
    const session = container.get('db_session')
    return new AccountRepository(db, session, console)
  },
  AccountService: async (container) => {
    const repository = await container.get('AccountRepository')
    return new AccountService(repository)
  },
  TransactionRepository: async (container) => {
    const db = await container.get('db_factory')
    const console = container.get('Console')
    const session = container.get('db_session')
    return new TransactionRespository(db, session, console)
  },
  TransactionService: async (container) => {
    const service = await container.get('AccountService')
    const repository = await container.get('TransactionRepository')
    const session = container.get('db_session')
    const uow = new UnitOfWork({
      session: session,
      accountService: service,
      transactionRepository: repository,
    })
    return new TransactionService({ uow })
  },
}
