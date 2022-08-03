const { MongoClient } = require('mongodb')
const { settings } = require('./settings')
const { Console } = require('console')
const fs = require('fs')
const AccountRepository = require('../src/account/repositories/AccountRepository')
const ServiceLayer = require('../src/account/service-layer/service')

client = new MongoClient(
  'mongodb://p2p:p2p@db:27017?retryWrites=true&w=majority'
)

module.exports = {
  db_factory: async () => {
    try {
      await client.connect()
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
    return new AccountRepository(db, console)
  },
  ServiceLayer: (container) => {
    repository = container.get('AccountRepository')
    return new ServiceLayer(repository)
  },
}
