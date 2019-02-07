'use strict'

exports.default = {
  get: require('./get').default,
  getById: require('./getById').default,
  post: require('./post').default,
  put: require('./put').default,
  delete: require('./delete').default,
  deleteUsersByIds: require('./deleteUsersByIds').default,
  resets: require('./resets').default,
  putResetPassword: require('./putResetPassword').default
}
