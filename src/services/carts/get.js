'use strict'

const { Cart } = require('../../database/models').default
const { calculatePrice } = require('../../utils').default

const action = async (req, res) => {
  const { cart } = req

  try {
    const payment = calculatePrice(cart)

    const result = await Cart.findOneAndUpdate(
      { _id: cart._id },
      { payment },
      { new: true })

    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = action
