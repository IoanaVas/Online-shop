'use strict'

const { Session } = require('../../database/models')

const action = async (req, res) => {
  const { accessToken } = req.headers

  try {
    await Session.deleteOne({ accessToken })
    res.status(200).end()
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

exports.default = action
