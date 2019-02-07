'use strict'

const mongoose = require('mongoose')

const { emailRegex, databasePasswordRegex } = require('../../utils').default

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
  username: {
    type: String,
    required: true
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
    default: 'user'
  }
})

const User = mongoose.model('User', schema)

exports.default = User
