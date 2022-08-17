const request = require('supertest')
const { bootstrap } = require('../app')

describe('Health', () => {
  let app

  beforeAll(async () => {
    const setup = await bootstrap()
    app = setup.app
  })

  it('It should response the GET method', async () => {
    var response = await request(app).get('/health')
    expect(response.statusCode).toBe(200)
  })

  
})
