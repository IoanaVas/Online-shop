'use strict'

const mongoose = require('mongoose')

const { emailRegex } = require('../../utils').default

const schema = new mongoose.Schema({
  resetToken: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: emailRegex
  }
})

const Reset = mongoose.model('Reset', schema)

exports.default = Reset
