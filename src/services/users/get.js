'use strict'

const { User } = require('../../database/models').default

const action = async (req, res) => {
  try {
    const users = await User.find({})

    res.status(200).json({ data: users })
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

exports.default = action
