'use strict'

const { Router } = require('express')

const { postSession, deleteSession } = require('./methods').default

const router = Router()

const routeByQueryParameter = list =>
  (req, res) =>
    list.find(item =>
      item.params.every(parameter => req.query[parameter])
    ).action(req, res)

router.post('/', routeByQueryParameter([
  { params: [], action: postSession }
]))

router.delete('/', routeByQueryParameter([
  { params: [], action: deleteSession }
]))

exports.default = router
