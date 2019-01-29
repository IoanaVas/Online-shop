'use strict'

const { User } = require('../models')

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.query.id)
    res.status(200).json({ data: user })
  } catch (error) {
    res.status(404).json({ data: {} })
  }
}

module.exports = {
  getUserById
}
