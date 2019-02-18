'use strict'

const { Product } = require('../../../database/models').default

const action = async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findById({ _id: id })

    product.media = []

    await product.save()
    res.status(200).end('Done!')
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ error: `The product with the id ${id} was not found.` })
      return
    }

    res.status(500).json({ error })
    return error
  }
}

exports.default = action
