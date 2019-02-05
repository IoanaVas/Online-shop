'use strict'

const { Router } = require('express')

const { sessions, users } = require('../services').default
const {
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter
} = require('../utils').default
const { Session, User } = require('../database/models').default

const router = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)
const RetrieveUserByToken = retrieveUserByToken(User, Session)

router.get(
  '/users/',
  routeByQueryParameter([
    { params: ['id'], action: users.getById },
    { params: [], action: users.get }
  ])
)
router.post('/users/', users.post)
router.put('/users/', CheckIfAuthorized, RetrieveUserByToken, users.put)
router.patch('/users/', CheckIfAuthorized, RetrieveUserByToken, users.patch)
router.delete('/users/', CheckIfAuthorized, RetrieveUserByToken, users.delete)

router.post('/sessions/', sessions.post)
router.delete('/sessions/', CheckIfAuthorized, sessions.delete)
router.get('/sessions/github/sessions/', sessions.github.oauth.get)

exports.default = router
