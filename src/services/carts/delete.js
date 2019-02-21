'use strict'

const { Cart } = require('../../database/models').default

const action = async (req, res) => {
  const { cartId } = req.params

  try {
    const cart = await Cart.findOneAndRemove({ _id: cartId })
    if (cart) {
      res.status(200).end('Cart deleted!')
      return
    }
    res.status(403).json({ error: `The cart with the Id ${cartId} doesn't exist.` })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(403).json({ error: 'Incorrect cart Id format.' })
      return
    }

    res.status(500).json({ error })
  }
}

exports.default = action
