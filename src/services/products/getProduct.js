'use strict'

const { Product } = require('../../database/models').default

const action = async (req, res) => {
  const { id } = req.params

  try {
    const result = await Product.findOne({ _id: id })

    if (!result) {
      res.status(404).json(`The product with id ${id} was not found`)
      return
    }

    res.status(200).json({ data: result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'The product id is invalid.' })
    } else {
      console.error(error)

      res.status(500).json({ error })
    }
  }
}

exports.default = action
