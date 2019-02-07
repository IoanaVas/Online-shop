'use strict'

exports.default = {
  get: require('./get').default,
  getById: require('./getById').default,
  post: require('./post').default,
  put: require('./put').default,
  delete: require('./delete').default,
  deleteUsers: require('./deleteUsers').default,
  resets: require('./resets').default,
  putResetPassword: require('./putResetPassword').default
}
