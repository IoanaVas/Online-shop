'use strict'

const { User } = require('../../database/models').default

const action = async (req, res) => {
  try {
    const { id } = req.query
    const user = await User.findById(id)

    if (user) {
      res.status(200).json({ data: user })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

exports.default = action
