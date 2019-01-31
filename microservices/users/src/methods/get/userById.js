'use strict'

const { User } = require('../../models').default

const getUserById = async (req, res) => {
  try {
    const { id } = req.query
    const user = await User.findById(id)

    if (user) {
      res.status(200).json({ data: user })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = getUserById
