'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const { user, session, product } = require('./src/routes').default
require('./src/database/config')

const app = express()

app.use(bodyParser.json())
app.use(user)
app.use(session)
app.use(product)

app.listen(8080)
