'use strict'

const axios = require('axios')

const { eventEmitter } = require('../../events').default
const { CLIENT_ID, CLIENT_SECRET } = require('../../../secrets.json')

const action = async (req, res) => {
  const { code } = req.query
  const url = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`

  try {
    const response = await axios.post(url, null,
      { headers: { accept: 'application/json' } })
    const accessToken = response.data.access_token
    await eventEmitter.emit('checkUser', accessToken)

    res.redirect(`/users?access_token=${accessToken}`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
