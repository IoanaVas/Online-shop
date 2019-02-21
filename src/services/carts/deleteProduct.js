'use strict'

const { Cart, Product } = require('../../database/models').default

const action = async (req, res) => {
  const { cartId } = req.params
  const productId = req.query.id

  try {
    const cart = await Cart.findById(cartId)
    const product = await Product.findById(productId)

    if (cart && product) {
      const products = cart.products.filter(product => product.id !== productId)
      await Cart.update({ products })
      res.status(200).end('Product removed!')
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(403).json({ error: 'Incorrect cart or product Id.' })
      return
    }

    res.status(500).json({ error })
  }
}

exports.default = action
