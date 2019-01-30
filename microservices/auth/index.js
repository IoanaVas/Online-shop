'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const { router } = require('./src').default
// require('./src/database/database')

const app = express()

app.use(bodyParser.json())
app.use('/sessions', router)

app.listen(8080)
