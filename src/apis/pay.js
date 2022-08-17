const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  let service = await req.getContainer('TransactionService')
  
  rs = await service.transfer(req.body.from, req.body.to, req.body.value)
  
  res.status(201).json({
    success: true,
    data: rs,
  })
})

module.exports = router
