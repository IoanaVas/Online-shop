'use strict'

const { validate } = require('../../utils').default
const { User } = require('../../database/models').default

const action = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      dateOfBirth
    } = req.body
    const { user } = req

    if (user) {
      const error = validate(email, password, username)

      if (error) {
        res.status(400).json({ error })
      } else {
        await User.updateOne(
          { _id: user._id },
          {
            ...(email && { email }),
            ...(password && { password }),
            ...(username && { username }),
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(dateOfBirth && { dateOfBirth })
          }
        )
        res.status(200).json({ data: user })
      }
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

exports.default = action
