const RunContainer = require('../../config/containers')
const CpfCnpjInvalid = require('../../src/account/entity/Exceptions')
const AccountSeed = require('../seed/account')

describe('Person Repository', () => {
  let connection
  let repository
  let container
  let facker

  beforeAll(async () => {
    container = await RunContainer.create()
    connection = await container.get('db_factory')
    repository = await container.get('AccountRepository')
    facker = new AccountSeed(repository)
  })

  afterEach(async () => {
    await connection.collection('account').deleteMany({})
  })

  // beforeEach(async () => {
  //   await connection.collection("account").deleteMany({});
  // });

  it('Test register person with success', async () => {
    const rs = await facker.createAccount()
    expect('_id' in rs).toBe(true)
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
    await facker.createAccount()
    await facker.createAccount()
    const rs = await repository.findAll()
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
    const rs = await facker.createAccount()
    await repository.active(rs._id)
    const ac1 = await repository.findById(rs._id)
    await repository.deposite(ac1.account_number, 10.0)
    const ac2 = await repository.findById(rs._id)
    expect(ac2.getBalance()).toBe(10.0)
  })

  it('deposit money in the account with error', async () => {
    const rs = await facker.createAccount()
    await expect(repository.deposite(rs.account_number, 10.0)).rejects.toThrow()
  })

  it('debit money in the account', async () => {
    const id = await facker.createAccount()
    await repository.active(id._id)
    const ac1 = await repository.findById(id._id)
    await repository.deposite(ac1.account_number, 10.0)
    await repository.debit(ac1.account_number, 2.0)
    const ac2 = await repository.findById(id._id)
    expect(ac2.getBalance()).toBe(8.0)
  })

  it('debit money in the account error', async () => {
    var rs = await facker.createAccount()
    await repository.active(rs._id)
    var ac1 = await repository.findById(rs._id)
    await expect(repository.debit(ac1.account_number, 2.0)).rejects.toThrow()
  })
})
