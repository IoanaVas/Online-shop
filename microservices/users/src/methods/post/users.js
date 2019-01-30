'use strict'

const crypto = require('crypto')

const { User } = require('../../models').default
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

const postUsers = async (req, res) => {
  try {
    const { email, password, username } = req.body
    const error = validate(email, password, username)
    const user = await User.create({
      email,
      password: crypto.createHash('sha256').update(password).digest('hex'),
      username
    }).then(data => ({
      _id: data._id,
      email: data.email,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth
    }))

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
        res.status(500).json({ error })
    }
  }
}

exports.default = postUsers
