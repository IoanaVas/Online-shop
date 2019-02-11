'use strict'

const { Product } = require('../../database/models').default
const { validate, priceRegex } = require('../../utils').default

const action = async (req, res) => {
  const { id } = req.params

  try {
    if (!(await Product.findById(id))) {
      res.status(404).json({ error: 'Product was not found' })
      return
    }

    const { name, price, quantity, description } = res.body
    const error =
      validate('Name', name) +
      validate('Price', price, priceRegex) +
      validate('Quantity', '' + quantity, /^([0]|[1-9][0-9]*)$/) +
      validate('Description', description)

    if (error) {
      res.status(400).json({ error })
      return
    }

    const product = await Product.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(price && { price }),
        ...(quantity && { quantity }),
        ...(description && { description })
      }
    )
    res.status(200).json({ data: product })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Product ID is invalid' })
    } else {
      console.error(error)
      res.status(500).json({ error: error })
    }
  }
}

exports.default = action
