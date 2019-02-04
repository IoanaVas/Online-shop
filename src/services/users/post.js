
'use strict'

const crypto = require('crypto')

const { User } = require('../../database/models').default
const { emailRegex, clientPasswordRegex } = require('../../utils').default

const validate = (email, password, username) => {
  let error = ''

  if (!email || (email && !emailRegex.test(email))) {
    error += 'E-mail is invalid\n'
  }
  if (!password || (password && !clientPasswordRegex.test(password))) {
    error += 'Password is invalid\n'
  }
  if (!username) error += 'Username is invalid\n'

  return error
}

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
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      dateOfBirth
    })

    if (!error) res.status(201).json({ data: user })
    else throw error
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
