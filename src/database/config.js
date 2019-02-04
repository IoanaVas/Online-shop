const mongoose = require('mongoose')

const config = require('../../config.json')

mongoose.connect(config.CONNECTION_STRING, { useNewUrlParser: true })
