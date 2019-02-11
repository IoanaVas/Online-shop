'use strict'

const { Product } = require('../../database/models').default

const action = async (req, res) => {
  const { id } = req.params

  try {
    if (!(await Product.findById(id))) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const product = await Product.findOneAndDelete({ _id: id })
    res.status(200).json({ data: product._doc })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Product ID is invalid' })
    } else {
      console.error(error)
      res.status(500).json({ error })
    }
  }
}

exports.default = action
