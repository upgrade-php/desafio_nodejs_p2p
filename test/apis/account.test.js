const request = require('supertest')
const { bootstrap } = require('../../app')

describe('Api Account', () => {
  let app
  let connection
  let repository
  let container

  beforeAll(async () => {
    const setup = await bootstrap()
    app = setup.app
    container = setup.container
    connection = await container.get('db_factory')
    repository = await container.get('AccountRepository')
  })

  afterEach(async () => {
    await connection.collection('account').deleteMany({})
  })

  it('api account get person by cpf or cnpj', async () => {
    const cpf_cnpj = '22124559095'
    await repository.create(
      'Vicente',
      '85986690542',
      'vpp.filho@gmail.com',
      cpf_cnpj,
      '67540045'
    )
    var response = await request(app).get('/person/' + cpf_cnpj)
    expect(response.statusCode).toBe(200)
    expect(!('password' in response.body.data)).toBe(true)
  })

})
