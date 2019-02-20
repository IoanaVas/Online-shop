'use strict'

const { Cart } = require('../../database/models').default

const action = async (req, res) => {
  const product = req.body
  const { cartId } = req.params

  try {
    const cart = await Cart.findOne({ _id: cartId })

    try {
      cart.products.push(product)
      await cart.save()

      res.status(201).json({ data: 'Updated!' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(403).json({ error: `The cart ${cartId} donesn't exist.` })
      return
    }
    res.status(500).json({ error })
  }
}

exports.default = action
