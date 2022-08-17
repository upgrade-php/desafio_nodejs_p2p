const routes = require('./apis/')

function configure_routers(app) {
  app.use('/health', routes.health_router)
  app.use('/person', routes.person_router)
  app.use('/pay', routes.pay_router)

  return app
}

module.exports = {
  configure_routers: configure_routers,
}
