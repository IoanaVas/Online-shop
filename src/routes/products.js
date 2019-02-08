'use strict'

const { Router } = require('express')

const { products } = require('../services/products').default
const { User, Session } = require('../database/models').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  checkUserPermission
} = require('../utils').default

const product = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)
const CheckUserPermission = checkUserPermission(User, Session)

product.post(
  '/products',
  CheckIfAuthorized,
  RetrieveUserByToken,
  CheckUserPermission,
  products.post)

exports.default = product
