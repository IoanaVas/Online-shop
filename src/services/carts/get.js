'use strict'

const { Cart, Product } = require('../../database/models').default
const { calculatePrice } = require('../../utils').default

const action = async (req, res) => {
  const { cartId } = req.params

  try {
    const cart = await Cart.findOne({ _id: cartId })

    cart.payment = await calculatePrice(cart, Product)

    res.status(200).json({ data: cart })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(403).json({ error: `The cart ${cartId} doesn't exist.` })
      return
    }
    res.status(500).json({ error })
  }
}

exports.default = action
