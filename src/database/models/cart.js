'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  products: {
    type: Array,
    default: []
  },
  payment: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    required: true
  }
})

const Cart = mongoose.model('Cart', schema)

exports.default = Cart
