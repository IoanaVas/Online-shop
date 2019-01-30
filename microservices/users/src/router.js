'use strict'

const { Router } = require('express')

const { getUsers, getUserById } = require('./get')

const router = Router()

const routeByQueryParameter = (param, noQueryFunction, queryFunction) =>
  (req, res) =>
    !req.query[param]
      ? noQueryFunction(req, res)
      : queryFunction(req, res)

router.get('/', routeByQueryParameter('id', getUsers, getUserById))

exports.default = router
