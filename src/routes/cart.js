'use strict'

const { Router } = require('express')

const { carts } = require('../services').default
const { User, Session, Product, Cart } = require('../database/models').default
const {
  routeByQueryParameter,
  checkIfAuthorized,
  retrieveUserByToken,
  checkProduct,
  getCart
} = require('../utils').default

const cart = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)
const CheckProduct = checkProduct(Product)
const GetCart = getCart(Cart)

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
  GetCart,
  CheckProduct,
  carts.postProduct
)
cart.get(
  '/cart/:cartId',
  CheckIfAuthorized,
  RetrieveUserByToken,
  GetCart,
  carts.get
)
cart.delete(
  '/cart/:cartId',
  CheckIfAuthorized,
  RetrieveUserByToken,
  GetCart,
  routeByQueryParameter([
    { params: ['id'], actions: [carts.deleteProduct] },
    { params: [], actions: [carts.delete] }
  ])
)

exports.default = cart
