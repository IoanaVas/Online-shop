'use strict'

const mongoose = require('mongoose')

const { priceRegex } = require('../../utils').default

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
    match: priceRegex
  },
  quantity: {
    type: Number,
    default: 0
  }
})

const Product = mongoose.model('Product', schema)

exports.default = Product
