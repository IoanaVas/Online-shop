'use strict'

const crypto = require('crypto')

const { User } = require('../../database/models').default
const { validate, emailRegex, clientPasswordRegex } = require('../../utils').default

const action = async (req, res) => {
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

  const error = `${validate('E-mail', email, emailRegex)}${validate('Password', password, clientPasswordRegex)}`

  try {
    if (error) {
      res.status(400).json({ error })
    } else if (user) {
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
