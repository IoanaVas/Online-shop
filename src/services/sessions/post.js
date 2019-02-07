'use strict'

const crypto = require('crypto')
const shortid = require('shortid')

const { stripProperties } = require('../../utils').default
const { Session, User } = require('../../database/models').default

const action = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'No password or email' })
    return
  }

  try {
    const user = await User
      .findOne({ email })
      .select('+passwordSalt +password')
      .exec()

    if (user) {
      const hash = crypto
        .createHash('sha256')
        .update(password + user._doc.passwordSalt)
        .digest('hex')

      if (hash === user._doc.password) {
        const { _id: userId } = user
        const accessToken = shortid.generate()
        const provider = 'shop'
        const session = await Session.create({ userId, accessToken, provider })

        res.status(201).json({
          data: stripProperties(
            ['_id', 'userId', 'externalToken'],
            session._doc
          )
        })
      } else {
        res.status(404).json({ error: 'User not found.' })
      }
    } else {
      res.status(404).json({ error: 'User not found.' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

exports.default = action
