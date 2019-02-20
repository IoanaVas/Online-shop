'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: 'No description.'
  },
  media: {
    type: Array,
    default: []
  }
})

const Product = mongoose.model('Product', schema)

exports.default = Product
