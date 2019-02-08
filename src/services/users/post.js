'use strict'

const crypto = require('crypto')
const shortid = require('shortid')

const {
  validate,
  stripProperties,
  emailRegex,
  clientPasswordRegex
} = require('../../utils').default
const { User } = require('../../database/models').default

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

  const error = `${validate('E-mail', email, emailRegex)}${validate('Password', password, clientPasswordRegex)}`

  try {
    if (error) {
      res.status(400).json({ error })
    } else {
      const passwordSalt = shortid.generate()
      const hashedPassword = crypto
        .createHash('sha256')
        .update(password + passwordSalt)
        .digest('hex')
      const user = await User.create({
        email,
        passwordSalt,
        password: hashedPassword,
        username,
        firstName,
        lastName,
        dateOfBirth,
        permission
      })

      res.status(201).json({
        data: stripProperties(['password', 'passwordSalt'], user._doc)
      })
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
