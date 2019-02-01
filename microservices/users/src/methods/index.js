'use strict'

exports.default = {
  ...require('./get').default,
  ...require('./post').default,
  ...require('./put').default,
  ...require('./patch').default,
  ...require('./delete').default
}
