'use strict'

const eventEmitter = require('./eventEmitter').default
const { Cart } = require('../database/models').default

const eventHandler = async (cart) => {
  try {
    await Cart.findByIdAndRemove(cart._id)
  } catch (err) {
    console.error(err)
  }
}

eventEmitter.on('deleteCart', eventHandler)
