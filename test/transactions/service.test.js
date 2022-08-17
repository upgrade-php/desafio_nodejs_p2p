const RunContainer = require('../../config/containers')
const AccountSeed = require('../seed/account')

jest.useRealTimers()
jest.setTimeout(70000)

describe('Service Transaction', () => {
  let container
  let repository
  let logger
  let connection
  let facker
  let service

  beforeAll(async () => {
    container = await RunContainer.create()
    connection = await container.get('db_factory')
    repository = await container.get('AccountRepository')
    logger = await container.get('Console')
    facker = new AccountSeed(repository)
  })

  beforeEach(async () => {
    logger.log(
      '--------->' + expect.getState().currentTestName + '<----------------'
    )
  })

  afterEach(async () => {
    await connection.collection('account').deleteMany({})
    await connection.collection('transaction').deleteMany({})
  })

  it('Create Transaction', async () => {
    const ac1 = await facker.createAccountActive({ deposite: 10.0 })
    const ac2 = await facker.createAccountActive()
    const valor = 10.0
    service = await container.get('TransactionService')
    const rs = await service.transfer(
      ac1.account_number,
      ac2.account_number,
      valor
    )
    expect(rs.value).toBe(10.0)
  })

  it('Create Error', async () => {
    const ac1 = await facker.createAccountActive({ deposite: 10.0 })
    const ac2 = await facker.createAccountActive()
    const valor = 11.0
    service = await container.get('TransactionService')
    await expect(
      service.transfer(ac1.account_number, ac2.account_number, valor)
    ).rejects.toThrow('There is not enough balance to carry out the operation')
  })

  it('Error 2', async () => {
    const ac1 = await facker.createAccountActive({ deposite: 10.0 })
    const ac2 = await facker.createAccountActive()
    const valor = -1
    service = await container.get('TransactionService')
    await expect(
      service.transfer(ac1.account_number, ac2.account_number, valor)
    ).rejects.toThrow('The value is invalid')
  })

  it('step 2', async () => {
    const ac1 = await facker.createAccountActive({ deposite: 10.0 })
    const ac2 = await facker.createAccountActive()
    const valor = 1.23
    service = await container.get('TransactionService')
    await service.transfer(ac1.account_number, ac2.account_number, valor)
    const rs1 = await repository.findById(ac1._id)
    const rs2 = await repository.findById(ac2._id)
    expect(rs1.getBalance()).toBe(8.77)
    expect(rs2.getBalance()).toBe(1.23)
  })

  it('implemente rallback', async () => {
    const ac1 = await facker.createAccountActive({ deposite: 10.0 })
    await facker.createAccountActive()
    const valor = 1.23
    service = await container.get('TransactionService')
    await expect(
      service.transfer(ac1.account_number, '85148430', valor)
    ).rejects.toThrow('Account number not exist:')
  })

 
})
