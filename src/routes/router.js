'use strict'

const { Router } = require('express')

const { sessions, users } = require('../services').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter,
  checkUserPermission
} = require('../utils').default
const { Session, User } = require('../database/models').default

const router = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)
const CheckUserPermission = checkUserPermission(User, Session)

router.get(
  '/users/',
  routeByQueryParameter([
    { params: ['id'], actions: [users.getById] },
    { params: [], actions: [users.get] }
  ])
)
router.post('/users/', users.post)
router.put(
  '/users/',
  routeByQueryParameter([
    { params: ['forgot'], actions: [users.putResetPassword] }]),
  CheckIfAuthorized, RetrieveUserByToken, users.put)
router.delete(
  '/users',
  CheckIfAuthorized,
  RetrieveUserByToken,
  routeByQueryParameter([
    { params: ['ids'],
      actions: [CheckUserPermission, users.deleteUsersByIds] }]),
  users.delete
)
router.post('/users/resets', users.resets.post)

router.post('/sessions/', sessions.post)
router.delete('/sessions/', CheckIfAuthorized, sessions.delete)
router.get('/sessions/github/oauth/', sessions.github.oauth.get)
router.get('/sessions/google/oauth/', sessions.google.oauth.get)

exports.default = router
