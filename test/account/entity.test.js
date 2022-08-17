const Person = require('../../src/account/entity/Person')

describe('Entity Person', () => {
  test('Test create entity person with success', () => {
    var p = new Person({
      name: 'Vicente',
      phone: '85986690651',
      email: 'vpp.filho@gmail.com',
      cpf_cnpj: '01475171331',
    })
    expect(p.name).toBe('Vicente')
    expect(p.phone).toBe('85986690651')
    expect(p.email).toBe('vpp.filho@gmail.com')
    expect(p.cpf_cnpj).toBe('01475171331')
  })

  test('Test create entity person with error', () => {
    expect(() => {
      new Person(1, 'Vicente')
    }).toThrow()
  })
})
