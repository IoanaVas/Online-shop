'use strict'

const { Product } = require('../../database/models').default

const action = async (req, res) => {
  const {
    name,
    price,
    quantity,
    description
  } = req.body

  try {
    const product = await Product.create({
      name,
      price,
      quantity,
      description
    })

    res.status(201).json({ data: product })
  } catch (error) {
    console.error(error)

    res.status(500).json({ error: 'Something went wrong...' })
  }
}

exports.default = action
