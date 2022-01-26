export default class LocalCache {
  cache;

  constructor(initialValues = {}) {
    this.cache = initialValues;
  }

  checkKey(key) {
    return this.cache[key];
  }

  push(key, value) {
    this.cache[key] = value
  }

  pop(key) {
    delete this.cache[key];
  }
}
