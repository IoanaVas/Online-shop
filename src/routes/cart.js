'use strict'

const { Router } = require('express')

const { carts } = require('../services').default
const { User, Session } = require('../database/models').default
const {
  checkIfAuthorized,
  retrieveUserByToken
} = require('../utils').default

const cart = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)

cart.post(
  '/cart',
  CheckIfAuthorized,
  RetrieveUserByToken,
  carts.post)

exports.default = cart
