'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Session = mongoose.model('Session', schema)

exports.default = Session
