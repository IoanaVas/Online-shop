'use strict'

const { Cart } = require('../../database/models').default

const action = async (req, res) => {
  const { cart } = req

  try {
    await Cart.findByIdAndRemove(cart._id)

    res.status(200).end('Cart deleted!')
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = action
