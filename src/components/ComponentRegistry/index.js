// Just a simple helper class for Compnent Transporter

class ComponentRegistry {
  constructor(registry = {}) {
    this._registry = registry;
  }

  getComponent = id => {
    return this._registry.components[id] ? this._registry.components[id] : null;
  }
}

export default ComponentRegistry;
