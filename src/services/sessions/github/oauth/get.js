'use strict'

const axios = require('axios')
const shortid = require('shortid')

const { eventEmitter } = require('../../../../events').default
const { stripProperties } = require('../../../../utils').default
const { Session } = require('../../../../database/models').default
const { GITHUB_OAUTH_URL } = require('../../../../../config.json')
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = require('../../../../../secrets.json')

const retrieveCredentialsFromProvider = code =>
  axios.post(
    `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
    null,
    {
      headers: {
        accept: 'application/json'
      }
    }
  )

const action = async (req, res) => {
  const { code } = req.query

  try {
    if (code) {
      const response = await retrieveCredentialsFromProvider(code)

      if (response.data.access_token) {
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
        res.status(400).json({
          error:
            response.data.error === 'bad_verification_code'
              ? 'The code provided seems to be used'
              : 'Bad request'
        })
      }
    } else {
      res.status(400).json({ error: 'No code as provided' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong...' })
  }
}

exports.default = action
