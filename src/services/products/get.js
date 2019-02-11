'use strict'

const { Product } = require('../../database/models').default

const action = async (req, res) => {
  try {
    console.log('7')
    const result = await Product.find({})

    res.status(200).json({ data: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
