const express = require('express')
const router = express.Router()

router.get('/:cpf_cnpj', async (req, res) => {
  let service = await req.getContainer('AccountService')
  let person = await service.findPersonByCpfOrCnpj(req.params.cpf_cnpj)

  res.status(200).json({
    success: true,
    data: person.toJson(true),
  })
})

module.exports = router
