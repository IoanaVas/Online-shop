'use strict'

const { Router } = require('express')

const { carts } = require('../services').default
const { Cart } = require('../database/models').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  checkUserPermission
} = require('../utils').default

const cart = Router()

cart.post('/cart', carts.post)

exports.default = cart
