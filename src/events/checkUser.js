'use strict'

const axios = require('axios')

const eventEmitter = require('./eventEmitter').default
const { GITHUB_LINK } = require('../../config.json')
const { User, Session } = require('../database/models').default

const eventHandler = async (accessToken) => {
  const url = GITHUB_LINK + accessToken

  try {
    const result = await axios.get(url)
    const { email } = result.data.find(item => item['primary'] === true)
    console.log('user email', email)
    const user = User.findOne({ email })
    if (user) {
      await Session.create({ userId: user._id, accessToken })
    } else {
      const newUser = await User.create({ email, password: 'lala' })
      await Session.create({ userId: newUser._id, accessToken })
    }
  } catch (error) {
    console.error(error)
  }
}

eventEmitter.on('checkUser', eventHandler)
