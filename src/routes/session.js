'use strict'

const { Router } = require('express')

const { sessions } = require('../services').default
const { checkIfAuthorized } = require('../utils').default
const { Session } = require('../database/models').default

const session = Router()

const CheckIfAuthorized = checkIfAuthorized(Session)

session.post('/sessions', sessions.post)
session.delete('/sessions', CheckIfAuthorized, sessions.delete)
session.get('/sessions/github/oauth', sessions.github.oauth.get)
session.get('/sessions/google/oauth', sessions.google.oauth.get)

exports.default = session
