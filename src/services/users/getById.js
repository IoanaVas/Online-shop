'use strict'

const { User } = require('../../database/models').default

const action = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    if (user) {
      res.status(200).json({ data: user })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'User not found' })
    } else {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong...' })
    }
  }
}

exports.default = action
