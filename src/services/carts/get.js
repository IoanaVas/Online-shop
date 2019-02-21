'use strict'

const { Cart } = require('../../database/models').default
const { calculatePrice } = require('../../utils').default

const action = async (req, res) => {
  const { cartId } = req.params

  try {
    const price = await calculatePrice(cartId, Cart)

    const cart = await Cart.findOneAndUpdate(
      { _id: cartId }, { payment: price })

    res.status(200).json({ data: cart })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(403).json({ error: `The cart ${cartId} doesn't exist.` })
      return
    }
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
