'use strict'

const eventEmitter = require('./eventEmitter').default
const { Product } = require('../database/models').default

const eventHandler = async (cart) => {
  setTimeout(emptyCart(cart), 5000)
}

const emptyCart = async (cart) => {
  console.log('cart')
  cart.products.map(async (item) => {
    console.log({ item })
    const product = await Product.findById(item['id'])
    product.quantity += item.quantity
    await product.save()
    console.log({ product })
  })
  // cart.products = []
  // await cart.save()
}

eventEmitter.on('emptyCart', eventHandler)

// 3600000
