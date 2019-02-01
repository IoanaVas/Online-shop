'use strict'

const { User, Session } = require('../../models').default
const { findUserByToken } = require('../../utils').default

const curriedFindUserByToken = findUserByToken(User, Session)

const deleteUser = async (req, res) => {
  try {
    const user = await curriedFindUserByToken(req.headers.authorization)

    if (user) {
      await User.deleteOne({ _id: user._id })
      res.status(200).json({ data: user })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = deleteUser
