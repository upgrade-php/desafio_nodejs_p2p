class ServiceLayer {
  constructor(repository) {
    this._repository = repository
  }

  async findPersonByCpfOrCnpj(cpf_cnpj) {
    return await this._repository.findPersonByCpfCnpj(cpf_cnpj)
  }
}

module.exports = ServiceLayer
