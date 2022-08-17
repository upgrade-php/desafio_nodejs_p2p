const Account = require('../../src/transaction/entity/Account')
const { Transaction } = require('../../src/transaction/entity/Transaction')

describe('Entity Transaction', () => {
  test('Test create entity transaction with success', () => {
    const a1 = new Account({
      account_number: '12345621',
      person_name: 'Vicente',
      cpf_cnpj: '01475171331',
    })

    const a2 = new Account({
      account_number: '22345622',
      person_name: 'Vicente',
      cpf_cnpj: '98146106072',
    })

    const t1 = new Transaction({
      from: a1,
      to: a2,
      value: 10.0,
    })

    const data = t1.toJson()
    expect(data['value']).toBe(10.0)
  })

  test('Test create entity transaction with error', () => {
    const a1 = new Account({
      account_number: '12345621',
      person_name: 'Vicente',
      cpf_cnpj: '01475171331',
    })

    expect(() => {
      new Transaction({
        from: a1,
        to: a1,
        value: 10.0,
      })
    }).toThrow('The target account needed be different the of source')
  })
})
