'use strict'

const { Router } = require('express')

const { users } = require('../services').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter,
  checkUsersAreEqual,
  checkUserPermission,
  routeNotFound
} = require('../utils').default
const { Session, User } = require('../database/models').default

const user = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)
const CheckUserPermission = checkUserPermission(User, Session)

user.get('/users', users.get)
user.get('/users/:id', users.getById)
user.post('/users', users.post)
user.put(
  '/users/:id',
  CheckIfAuthorized,
  RetrieveUserByToken,
  checkUsersAreEqual,
  users.put
)
user.put(
  '/users',
  routeByQueryParameter([
    { params: ['forgot'], actions: [users.putResetPassword] }
  ])
)
user.delete(
  '/users/:id',
  CheckIfAuthorized,
  RetrieveUserByToken,
  checkUsersAreEqual,
  users.delete
)
user.delete(
  '/users',
  CheckIfAuthorized,
  RetrieveUserByToken,
  CheckUserPermission,
  users.deleteUsersByIds
)
user.post('/users/resets', users.resets.post)

exports.default = user
