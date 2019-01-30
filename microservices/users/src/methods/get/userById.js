'use strict'

const { User } = require('../../models').default

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.query.id)
    res.status(200).json({ data: user })
  } catch (error) {
    console.log(error)
    res.status(404).json({ error })
  }
}

exports.default = getUserById
