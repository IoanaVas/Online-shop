'use strict'

const crypto = require('crypto')

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
    const error = validate(email, password, username)

    if (error) {
      res.status(400).json({ error })
    } else {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
      const user = await User.create({
        email,
        password: hashedPassword,
        username,
        firstName,
        lastName,
        dateOfBirth
      })

      res.status(201).json({ data: user })
    }
  } catch (error) {
    switch (error.code) {
      case 11000:
        res.status(400).json({
          error: "Can't create: email already exists in the database"
        })
        break
      default:
        console.error(error)
        res.status(500).end({ error: 'Something went wrong...' })
    }
  }
}

exports.default = action
