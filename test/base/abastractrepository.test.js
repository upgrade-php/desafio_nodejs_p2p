const { Account } = require('../../src/account/entity/Account')
const { CreateFactory } = require('../../src/base/CreateFactory')

describe('Base', () => {
  let factory
  beforeAll(async () => {})

  test('Create factory to load from db', async () => {
    factory = CreateFactory(Account.name)
    expect(factory.name).toBe('AccountFactory')
  })

  test('Create factory to load from db with error', async () => {
    const rs = CreateFactory('Account1')
    expect(rs).toBe(undefined)
  })

})
