'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const { router } = require('./src')
require('./src/database/database')

const app = express()

app.use(bodyParser.json())
app.use('/users', router)

app.listen(8080)
