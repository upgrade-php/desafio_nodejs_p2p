const logResponseBody = require('./log_response')
var bodyParser = require('body-parser')

function configure_middleware(app) {
  app.use(bodyParser.json())
  app.use(logResponseBody)

  return app
}

module.exports = configure_middleware
