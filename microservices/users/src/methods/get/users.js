'use strict'

const { User } = require('../../models').default

const getUser = async (req, res) => {
  try {
    const users = await User.find({})

    res.status(200).json({ data: users })
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = getUser
