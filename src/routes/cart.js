'use strict'

const { Router } = require('express')

const { carts } = require('../services').default
const { User, Session, Product } = require('../database/models').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  checkProduct
} = require('../utils').default

const cart = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)
const CheckProduct = checkProduct(Product)

cart.post(
  '/cart',
  CheckIfAuthorized,
  RetrieveUserByToken,
  carts.post
)
cart.post(
  '/cart/:cartId',
  CheckIfAuthorized,
  RetrieveUserByToken,
  CheckProduct,
  carts.postProduct
)
cart.get(
  '/cart/:cartId',
  CheckIfAuthorized,
  RetrieveUserByToken,
  carts.get
)

exports.default = cart
