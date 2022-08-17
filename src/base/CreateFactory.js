const glob = require('glob')
const path = require('path')

class CreateFactory {
  constructor() {
    this._container = {}
    this._loadFactories()
  }

  create(nameEntity) {
    return this._requireFactory(this._resolveNameFactory(nameEntity))
  }

  _resolveNameFactory(name) {
    name = name.charAt(0).toUpperCase() + name.slice(1)
    return name + 'Factory'
  }

  _requireFactory(name) {
    try {
      return this._container[name]
    } catch {
      return null
    }
  }

  async _loadFactories() {
    const c = {}
    glob.sync('./src/*/factory/*.js').forEach(function (file) {
      const r = require(path.resolve(file))
      c[r.name] = r
    })

    this._container = c
  }
}

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new CreateFactory()
    }
  }

  getInstance() {
    return Singleton.instance
  }
}

module.exports = {
  CreateFactory: (name) => {
    let instance = new Singleton().getInstance()
    return instance.create(name)
  },
}
