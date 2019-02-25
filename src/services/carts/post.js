'use strict'

const { Cart } = require('../../database/models').default

const action = async (req, res) => {
  try {
    const userId = req.user._id
    const cart = await Cart.findOne({ userId })

    if (cart) {
      res.status(409).json(`The user with the id ${userId} already has a shopping cart`)
      return
    }
    const result = await Cart.create({ userId })

    res.setHeader('Location', `/cart/${result._id}`)
    res.status(201).json({ data: result })
  } catch (error) {
    res.status(500).json({ error: 'Oops, something went wrong...' })
  }
}

exports.default = action
