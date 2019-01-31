'use strict'

const { Router } = require('express')

const { postSession, deleteSession } = require('./methods').default

const router = Router()

router.post('/', postSession)
router.delete('/', deleteSession)

exports.default = router
