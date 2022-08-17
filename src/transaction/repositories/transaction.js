const AbstractRepository = require('../../base/AbastractRespository')
const { TransactionState, Transaction } = require('../entity/Transaction')

class TransactionRespository extends AbstractRepository {
  constructor(db, session, logger) {
    super(db, Transaction, logger, session)
  }

  async create(transction) {
    transction.setStatus(TransactionState.stateRegistered())
    const rs = await this.save(transction)
    return await this.findById(rs.insertedId.toString())
  }
}

module.exports = TransactionRespository
