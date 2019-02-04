'use strict'

const crypto = require('crypto')
const shortid = require('shortid')

const { Session, User } = require('../../database/models')

const action = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'No password or email' })
    return
  }

  const accessToken = shortid.generate()
  const hash = crypto.createHash('sha256').update(password).digest('hex')

  try {
    const user = await User.findOne({ email, password: hash })

    if (user) {
      const { _id: userId } = user
      const session = await Session.create({ userId, accessToken })
      res.status(201).json({ data: session })
    } else {
      res.status(404).json({ error: 'User not found.' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

exports.default = action
