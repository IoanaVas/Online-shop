'use strict'

const mongoose = require('mongoose')

const { emailRegex, passwordRegex } = require('../utils').default

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true,
    match: passwordRegex
  },
  username: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  birthDate: Date
})

const User = mongoose.model('User', schema)

exports.default = User
