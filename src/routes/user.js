'use strict'

const { Router } = require('express')

const { users } = require('../services').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter,
  checkUserPermission
} = require('../utils').default
const { Session, User } = require('../database/models').default

const user = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)
const CheckUserPermission = checkUserPermission(User, Session)

user.get(
  '/users',
  routeByQueryParameter([
    { params: ['id'], actions: [users.getById] },
    { params: [], actions: [users.get] }
  ])
)
user.post('/users', users.post)
user.put(
  '/users',
  routeByQueryParameter([
    { params: ['forgot'], actions: [users.putResetPassword] }]),
  CheckIfAuthorized, RetrieveUserByToken, users.put)
user.delete(
  '/users',
  CheckIfAuthorized,
  RetrieveUserByToken,
  routeByQueryParameter([
    { params: ['ids'],
      actions: [CheckUserPermission, users.deleteUsersByIds] }]),
  users.delete
)
user.post('/users/resets', users.resets.post)

exports.default = user
