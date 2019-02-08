'use strict'

const { validate } = require('../../utils').default
const crypto = require('crypto')

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
      permission
    } = req.body
    const { user } = req

    if (user) {
      if (permission && user.permission !== 'admin') {
        res.status(403).json({ error: "Can't change permission as a user" })
        return
      }
      await User.updateOne(
        { _id: user._id },
        {
          ...(email && { email }),
          ...(password && {
            password: crypto
              .createHash('sha256')
              .update(password + user.passwordSalt)
              .digest('hex')
          }),
          ...(username && { username }),
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(permission && user.permission === 'admin' && { permission })
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
