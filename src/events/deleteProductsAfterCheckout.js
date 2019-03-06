'use strict'

const { Product } = require('../database/models').default
const eventEmitter = require('./eventEmitter').default

const eventHandler = async (cart) => {
  cart.products.map(async (item) => {
    const product = await Product.findById(item['id'])
    product.quantity -= item.quantity
    await product.save()
  })
}

eventEmitter.on('deleteProducts', eventHandler)
