const { db_factory, Console } = require('../../config/dependences')
const AccountRepository = require('../../src/account/repositories/AccountRepository')
const faker = require('faker-br')
const CpfCnpjInvalid = require('../../src/account/entity/Exceptions')

faker.locale = 'pt_BR'

describe('Person Repository', () => {
  let connection
  let logger
  let repository

  beforeAll(async () => {
    connection = await db_factory()
    logger = await Console()
    repository = createAccountRepository()
  })

  afterEach(async () => {
    await connection.collection('account').deleteMany({})
  })

  beforeEach(async () => {
    await connection.collection('account').deleteMany({})
  })

  let createAccountRepository = () => {
    return new AccountRepository(connection, logger)
  }

  let createAccount = async () => {
    return await repository.create(
      faker.name.firstName(),
      faker.phone.phoneNumber('8598#######'),
      faker.internet.email(),
      faker.br.cpf(),
      faker.internet.password()
    )
  }

  it('Test register person with success', async () => {
    var rs = await createAccount()
    expect(rs['acknowledged']).toBe(true)
  })

  it('Test register person with error', async () => {
    await expect(
      repository.create('Vicente', '85986690542', 'vpp.filho@gmail.com', '0')
    ).rejects.toThrow()
  })

  it('Test register person no duplicate cpf', async () => {
    await repository.create(
      'Vicente',
      '85986690542',
      'vpp.filho@gmail.com',
      '01475171331',
      'vicente0'
    )
    await expect(
      repository.create(
        'Vicente',
        '85986690542',
        'vpp.filho2@gmail.com',
        '01475171331',
        'vicente0'
      )
    ).rejects.toThrow()
  })

  it('Test register person no duplicate email or cpf', async () => {
    await repository.create(
      'Vicente',
      '85986690542',
      'vpp.filho@gmail.com',
      '01475171331',
      'vicente0'
    )
    await expect(
      repository.create(
        'Vicente',
        '85986690542',
        'vpp.filho@gmail.com',
        '01475171331',
        'vicente0'
      )
    ).rejects.toThrow()
  })

  it('Test list all persons', async () => {
    await createAccount()
    await createAccount()
    var rs = await repository.findAll()
    expect(rs.length).toBe(2)
  })

  it('Test create accout with cpf null', async () => {
    await expect(
      repository.create(
        'Vicente',
        '85986690542',
        'vpp.filho@gmail.com',
        null,
        'vicente0'
      )
    ).rejects.toThrow(CpfCnpjInvalid)
  })

  it('deposit money in the account', async () => {
    var id = await createAccount()
    await repository.active(id.insertedId.toString())
    var ac1 = await repository.findById(id.insertedId.toString())
    await repository.deposite(ac1.account_number, 10.0)
    var ac2 = await repository.findById(id.insertedId.toString())
    expect(ac2.getBalance()).toBe(10.0)
  })

  it('deposit money in the account with error', async () => {
    var id = await createAccount()
    var ac1 = await repository.findById(id.insertedId.toString())
    await expect(
      repository.deposite(ac1.account_number, 10.0)
    ).rejects.toThrow()
  })

  it('debit money in the account', async () => {
    var id = await createAccount()
    await repository.active(id.insertedId.toString())
    var ac1 = await repository.findById(id.insertedId.toString())
    await repository.deposite(ac1.account_number, 10.0)
    await repository.debit(ac1.account_number, 2.0)
    var ac2 = await repository.findById(id.insertedId.toString())
    expect(ac2.getBalance()).toBe(8.0)
  })

  it('debit money in the account error', async () => {
    var id = await createAccount()
    await repository.active(id.insertedId.toString())
    var ac1 = await repository.findById(id.insertedId.toString())
    await expect(repository.debit(ac1.account_number, 2.0)).rejects.toThrow()
  })
})
