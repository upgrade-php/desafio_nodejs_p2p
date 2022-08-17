const { bootstrap } = require('./app')
const port = process.env.PORT || 8080

bootstrap().then(({ app }) => {
  app.listen(port, () => {
    console.log('Example app listening on port !')
  })
})
