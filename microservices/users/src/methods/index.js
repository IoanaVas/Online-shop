'use strict'

exports.default = {
  ...require('./get').default,
  ...require('./post').default,
  ...require('./delete').default
}