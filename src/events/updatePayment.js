'use strict'

const eventEmitter = require('./eventEmitter').default

const { Cart } = require('../database/models').default
const { calculatePrice } = require('../utils').default

const eventHandler = async (cart) => {
  const payment = calculatePrice(cart)

  try {
    await Cart.findOneAndUpdate(
      { _id: cart._id },
      { payment })
  } catch (error) {
    console.error(error)
    throw error
  }
}

eventEmitter.on('updatePayment', eventHandler)
