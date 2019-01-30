'use strict'

const { Router } = require('express')

const { getUsers, getUserById } = require('./methods').default

const router = Router()

const routeByQueryParameter = list =>
  (req, res) =>
    list.find(item =>
      item.params.every(parameter => req.query[parameter])
    ).action(req, res)

router.get('/', routeByQueryParameter([
  { params: ['id'], action: getUserById },
  { params: [], action: getUsers }
]))

exports.default = router
