'use strict'

exports.default = {
  ...require('./utils').default,
  sendEmail: require('./mailer').default
}
