const request = require('supertest')
const { bootstrap } = require('../../app')
const AccountSeed = require('../seed/account')
const TransactionSeed = require('../seed/transactions')

jest.useRealTimers()
jest.setTimeout(70000)

describe('Api Account', () => {
  let app
  let connection
  let repository
  let container
  let facker

  beforeAll(async () => {
    const setup = await bootstrap()
    app = setup.app
    container = setup.container
    connection = await container.get('db_factory')
    repository = await container.get('AccountRepository')
    facker = new TransactionSeed(new AccountSeed(repository))
  })

  afterEach(async () => {
    await connection.collection('account').deleteMany({})
    await connection.collection('transaction').deleteMany({})
  })

  it('api pay p2p', async () => {
    const contas = await facker.startCase()

    data = {
        from: contas.conta1.account_number,
        to: contas.conta2.account_number,
        value: 8.17
    }
    var response = await request(app).post('/pay').send(data)
    expect(response.statusCode).toBe(201)
  })

  it('api pay p2p error', async () => {
    const contas = await facker.startCase()

    data = {
        from: contas.conta1.account_number,
        to: contas.conta2.account_number,
        value: 'a'
    }
    var response = await request(app).post('/pay').send(data)
    expect(response.statusCode).toBe(403)
  })

})
