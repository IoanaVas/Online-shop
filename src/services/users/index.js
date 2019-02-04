'use strict'

exports.default = {
  get: require('./get').default,
  getById: require('./getById').default,
  post: require('./post').default,
  put: require('./put').default,
  patch: require('./patch').default,
  delete: require('./delete').default,
  resets: require('./resets').default
}
