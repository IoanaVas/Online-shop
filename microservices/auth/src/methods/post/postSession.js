'use strict'

const crypto = require('crypto')
const shortid = require('shortid')

const { Session, User } = require('../../models')

const postSession = async (req, res) => {
  const { email, password } = req.body
  const userId = req.query.id

  if (!email || !password) {
    res.status(400).json({ error: 'No password or email' })
    return
  }

  const accessToken = shortid.generate()
  const hash = crypto.createHash('sha256').update(password).digest('hex')

  try {
    if (await User.find({ email, password: hash })) {
      const session = await Session.create({ userId, accessToken })
      res.status(200).json({ data: session })
    } else {
      res.status(404).end()
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = postSession
