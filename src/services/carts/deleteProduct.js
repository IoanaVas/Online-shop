'use strict'

const { Cart, Product } = require('../../database/models').default
const { eventEmitter } = require('../../events').default

const action = async (req, res) => {
  const { cart } = req
  const productId = req.query.id

  try {
    await Product.findById(productId)

    const products = cart.products.filter(product => product.id !== productId)

    if (products !== cart.products) {
      const result = await Cart.findByIdAndUpdate(
        { _id: cart._id },
        { products },
        { new: true, fields: 'products' })

      eventEmitter.emit('updatePayment', result)

      res.status(200).json({ data: result })
      return
    }
    res.status(404).json({ error: `The product with the id ${productId} doesn't exist in the shopping cart.` })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(403).json({ error: 'Incorrect product Id.' })
      return
    }

    res.status(500).json({ error })
  }
}

exports.default = action
