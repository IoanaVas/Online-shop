'use strict'

exports.default = {
  ...require('./utils').default,
  sendMail: require('./mailer').default
}
