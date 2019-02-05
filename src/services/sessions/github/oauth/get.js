'use strict'

const axios = require('axios')
const shortid = require('shortid')

const { eventEmitter } = require('../../../../events').default
const { stripProperties } = require('../../../../utils').default
const { Session } = require('../../../../database/models').default
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = require('../../../../../secrets.json')

const retrieveCredentialsFromProvider = code =>
  axios.post(
    `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
    null,
    {
      headers: {
        accept: 'application/json'
      }
    }
  )

const action = async (req, res) => {
  const { code } = req.query

  if (code) {
    const response = await retrieveCredentialsFromProvider(code)

    const session = await Session.create({
      userId: '000000000000000000000000',
      accessToken: shortid.generate(),
      externalToken: response.data.access_token,
      provider: 'github'
    })

    res.status(200).json({
      data: stripProperties(['_id', 'userId'], session._doc)
    })

    eventEmitter.emit('OAuthUser', session._doc)
  } else {
    res.status(400).json({ error: 'No code as provided' })
  }
}

exports.default = action
