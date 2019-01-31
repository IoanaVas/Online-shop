'use strict'

const { Router } = require('express')

const { postSession } = require('./methods').default

const router = Router()

router.post('/', postSession)

exports.default = router
