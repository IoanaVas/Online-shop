'use strict'

const { Cart } = require('../../database/models').default
const { eventEmitter } = require('../../events').default

const action = async (req, res) => {
  const product = req.body
  const { productFromInventory } = req
  const { cart } = req

  if (cart.products.find(productFromCart => productFromCart.id === product.id)) {
    try {
      const result = await Cart.findOneAndUpdate(
        { '_id': cart._id, 'products.id': product.id },
        { $set: { 'products.$.quantity': product.quantity } },
        { new: true, fields: 'products' })

      eventEmitter.emit('updatePayment', result)

      res.status(201).json({ data: result })
    } catch (error) {
      res.status(500).json({ error: 'Oops, something went wrong.' })
    }
  } else {
    product['price'] = productFromInventory.price

    try {
      cart.products.push(product)

      let result = await Cart.findOneAndUpdate(
        { '_id': cart._id },
        { products: cart.products },
        { new: true, fields: 'products' })

      eventEmitter.emit('updatePayment', result)

      res.status(201).json({ data: result })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}

exports.default = action
