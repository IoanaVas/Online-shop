'use strict'

const { Router } = require('express')

const { products } = require('../services').default
const { User, Session } = require('../database/models').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  checkUserPermission,
  routeByQueryParameter
} = require('../utils').default

const product = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)

product.get(
  '/products',
  routeByQueryParameter([
    { params: ['ids'], actions: [products.getProducts] },
    { params: [], actions: [products.get] }
  ]))
product.get('/products/:id', products.getProduct)
product.post(
  '/products',
  CheckIfAuthorized,
  RetrieveUserByToken,
  checkUserPermission,
  products.post
)
product.post(
  '/products/:id/media',
  CheckIfAuthorized,
  RetrieveUserByToken,
  checkUserPermission,
  products.media.post
)
product.put(
  '/products/:id',
  CheckIfAuthorized,
  RetrieveUserByToken,
  checkUserPermission,
  products.put
)
product.delete(
  '/products/:id',
  CheckIfAuthorized,
  RetrieveUserByToken,
  checkUserPermission,
  products.delete
)
product.delete(
  '/products/:id/media',
  CheckIfAuthorized,
  RetrieveUserByToken,
  checkUserPermission,
  products.media.delete
)

exports.default = product
