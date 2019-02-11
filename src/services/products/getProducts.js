'use strict'

const { Product } = require('../../database/models').default

const action = async (req, res) => {
  const ids = req.query.ids.split(',')

  try {
    const result = await Product.find({ _id: { $in: ids } })

    if (result.length !== ids.length) {
      res.status(404).json(`One or more products were not found`)
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
