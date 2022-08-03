const container = require('./dependences')

class RunContainer {
  constructor() {
    this._container = {}
  }

  _hasContainer(name) {
    return name in this._container
  }

  async configure() {
    for (var name in container) {
      if (!this._hasContainer(name)) {
        await this._createAndRegister(name)
      }
    }
  }

  _addContainer(name, value) {
    this._container[name] = value
  }

  async _createDependence(name) {
    return await container[name](this)
  }

  async _createAndRegister(name) {
    if (!(name in container)) {
      return false
    }
    const deps = await this._createDependence(name)
    this._addContainer(name, deps)
    return true
  }

  get(name) {
    return this._container[name]
  }

  static async create() {
    let c = new RunContainer()
    await c.configure()
    return c
  }
}

module.exports = RunContainer
