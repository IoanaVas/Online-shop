'use strict'

const { Product } = require('../../database/models').default

const action = async (req, res) => {
  const { id } = req.params

  try {
    const result = await Product.findOne({ _id: id })

    res.status(200).json({ data: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
