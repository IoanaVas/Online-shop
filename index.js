'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const { router } = require('./src/routes').default
require('./src/database/config')

const app = express()

app.use(bodyParser.json())
app.use(router)

app.listen(8080)
