const RunContainer = require('./config/containers')
const configure_middleware = require('./src/apis/middlewares/register')
require('express-async-errors');
const app = require('express')()
const { configure_routers } = require('./src/routes')

async function bootstrap() {
  let container = await RunContainer.create()

  const deps = (req, res, next) => {
    req.getContainer = (name) => container.get(name)
    next()
  }
  app.use(deps)
  configure_middleware(app)
  configure_routers(app)

  app.use((err, req, res, next) => {
    if(err.message){
      res.status(403);
      return res.json({ error: err.message });
    }    
    next(err);
  });

  return { app, container }
}

module.exports = {
  bootstrap: bootstrap,
}
