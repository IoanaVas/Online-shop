'use strict'

const mongoose = require('mongoose')

const { emailRegex } = require('../utils').default

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: emailRegex,
    unique: true
  },
  resetToken: {
    type: String,
    required: true,
    unique: true
  }
})

const Reset = mongoose.model('Reset', schema)

exports.default = Reset
