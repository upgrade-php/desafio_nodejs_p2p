async function logResponseBody(req, res, next) {
  var oldWrite = res.write,
    oldEnd = res.end
  const logger = await req.getContainer('Console')
  var chunks = []

  logger.log('REQUEST START', '--------------------------')
  logger.log('REQUEST', { content: req.body, endpoint: req.originalUrl })

  res.write = function (chunk) {
    chunks.push(chunk)
    return oldWrite.apply(res, arguments)
  }

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk)

    var body = Buffer.concat(chunks).toString('utf8')
    logger.log('REPONSE', { content: body, endpoint: req.originalUrl })
    logger.log('REPONSE END', '--------------------------')
    oldEnd.apply(res, arguments)
  }

  next()
}

module.exports = logResponseBody
