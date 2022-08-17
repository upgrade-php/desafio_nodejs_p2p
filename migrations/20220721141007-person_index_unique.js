module.exports = {
  async up(db, client) {
    db.collection('account').createIndex(
      { 'person.cpf_cnpj': 1 },
      { unique: true }
    )
    db.collection('account').createIndex(
      { 'person.email': 1 },
      { unique: true }
    )
    db.collection('account').createIndex(
      { account_number: 1 },
      { unique: true }
    )
    return
  },

  async down(db, client) {},
}
