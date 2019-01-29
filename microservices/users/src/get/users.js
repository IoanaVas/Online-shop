'use strict'

const { User } = require('../models')

const getUsers = async (req, res) => {
  const users = await User.find({})
  res.status(200).json({ data: users })
}

module.exports = {
  getUsers
}
