const { CreateFactory } = require('./CreateFactory')
const ObjectId = require('mongodb').ObjectId

class AbstractRepository {
  constructor(db, repository_name, logger, session) {
    this.setDb(db)
    this.setNameCollection(repository_name)
    this.configureRepository()
    this.logger = logger
    this.factory = CreateFactory(this.collectionName)
    this._session = session
  }

  setDb(db) {
    if (!db) {
      throw new Error('Database not informed')
    }
    this.db = db
  }

  configureRepository() {
    this.repository = this.getCollection(this.collectionName)
  }

  setNameCollection(collection) {
    if (typeof collection == 'function') {
      this.collectionName = collection.name.toLowerCase()
    } else {
      this.collectionName = collection.toLowerCase()
    }
  }

  getCollection(name) {
    return this.db.collection(name)
  }

  async save(entity) {
    const data = await entity.toJson()
    this.logger.log('DOCUMENT DATA', data)
    let document = null

    if (!data['_id']) {
      let doc = Object.assign({}, data, { created_at: new Date() })
      if (!this._session) {
        document = await this.repository.insertOne(doc)
      } else {
        const session = this._session
        document = await this.repository.insertOne(doc, { session })
      }

      this.logger.log('DOCUMENT INSERTED', document)
      return document
    }

    const data2 = Object.assign({}, data, { updated_at: new Date() })
    if (!this._session) {
      document = await this.repository.updateOne(
        { _id: data2['_id'] },
        { $set: data2 }
      )
    } else {
      const session = this._session
      document = await this.repository.updateOne(
        { _id: data2['_id'] },
        { $set: data2 },
        { session }
      )
    }

    this.logger.log('DOCUMENT UPDATED', document)

    return document
  }

  async findOneBy(where) {
    this.logger.log('QUERY:', where)
    const session = this._session
    const rs = await this.repository.findOne(where, { session })
    this.logger.log('QUERY RESULT', rs)
    if (!rs) {
      return null
    }
    return this.factory.loadFromDb(rs)
  }

  async findById(id) {
    return await this.findOneBy({ _id: new ObjectId(id) })
  }
}

module.exports = AbstractRepository
