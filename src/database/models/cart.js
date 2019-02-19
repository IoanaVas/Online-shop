'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  products: {
    type: Array,
    default: []
  }
})

const Cart = mongoose.model('Cart', schema)

exports.default = Cart
