'use strict'

exports.default = {
  eventEmitter: require('./eventEmitter').default
}

require('./handleChangedPassword')
require('./handleOAuthUser')
require('./deleteUsersSessions')
require('./updatePayment')
require('./deleteProductsAfterCheckout')
require('./deleteCart')
require('./emptyCart')
