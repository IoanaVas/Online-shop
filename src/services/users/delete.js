'use strict'

const { User } = require('../../database/models').default

const action = async (req, res) => {
  try {
    const { user } = req

    if (user) {
      await User.deleteOne({ _id: user._id })
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
