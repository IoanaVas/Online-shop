'use strict'

const { User } = require('../models')

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json({ data: users })
  } catch (err) {
    res.status(404).json({ data: err })
  }
}

module.exports = {
  getUsers
}
