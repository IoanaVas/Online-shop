'use strict'

const { Product } = require('../../database/models').default

const action = async (req, res) => {
  const { ids } = req.query

  try {
    const result = await Product.find({ _id: { $in: [ids] } })

    res.status(200).json({ data: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
