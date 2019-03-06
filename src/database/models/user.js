'use strict'

const mongoose = require('mongoose')

const { emailRegex, databasePasswordRegex } = require('../../utils')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: emailRegex,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    match: databasePasswordRegex
  },
  passwordSalt: {
    type: String,
    required: true,
    select: false
  },
  username: {
    type: String
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  birthDate: {
    type: Date,
    default: new Date()
  },
  permission: {
    type: String,
    required: true,
    default: 'user'
  },
  stripeId: {
    type: String,
    default: ''
  }
})

const User = mongoose.model('User', schema)

exports.default = User
