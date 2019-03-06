'use strict'

const { Router } = require('express')

const { User, Session, Cart } = require('../database/models').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  getCart,
  getStripeToken,
  createStripeCustomer
} = require('../utils').default

const { payments } = require('../services').default

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)
const GetCart = getCart(Cart)

const payment = Router()

payment.post(
  '/payment',
  CheckIfAuthorized,
  RetrieveUserByToken,
  GetCart,
  getStripeToken,
  createStripeCustomer,
  payments.post
)
exports.default = payment
