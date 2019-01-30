'use strict'

const { User } = require('../models')

exports.default = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json({ data: users })
  } catch (error) {
    res.status(404).json({ error })
  }
}
