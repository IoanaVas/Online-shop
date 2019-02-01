'use strict'

const { User, Session } = require('../../models').default
const { findUserByToken } = require('../../utils').default

const curriedFindUserByToken = findUserByToken(User, Session)

const patchUser = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      dateOfBirth
    } = req.body
    const user = await curriedFindUserByToken(req.headers.authorization)

    if (user) {
      await User.updateOne({ _id: user._id }, {
        ...(email && { email }),
        ...(password && { password }),
        ...(username && { username }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(dateOfBirth && { dateOfBirth })
      })
      res.status(200).json({ data: user })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = patchUser
