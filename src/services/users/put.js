'use strict'

const { User } = require('../../database/models').default

const action = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      dateOfBirth,
      permissions
    } = req.body
    const { user } = req

    if (user) {
      if (permissions && user.permissions !== 'admin') {
        res.status(401).json({ error: "Can't change permissions as a user" })
        return
      }
      await User.updateOne(
        { _id: user._id },
        {
          ...(email && { email }),
          ...(password && { password }),
          ...(username && { username }),
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(permissions && user.permissions === 'admin' && { permissions })
        }
      )
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
