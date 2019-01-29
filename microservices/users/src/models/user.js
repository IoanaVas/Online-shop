'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*[@][a-z]+[.][a-z]+$/
  },
  password: {
    type: String,
    required: true,
    match: /^[a-z0-9]{64}$/
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

module.exports = {
  User
}
