'use strict'

const axios = require('axios')
const crypto = require('crypto')

const eventEmitter = require('./eventEmitter').default
const { Session, User } = require('../database/models').default
const { GITHUB_API_URL } = require('../../config.json')

const createUser = async user => {
  const names = user.name.match(/\w+/g)
  const firstName = names[0]
  const lastName = names.filter((_, index) => index !== 0).join(' ')

  return User.create({
    email: user.email,
    password: crypto
      .createHash('sha256')
      .update('' + Date.now())
      .digest('hex'),
    username: user.login,
    firstName,
    lastName
  })
}

const handleUser = async (session, user) => {
  try {
    const userFromDatabase =
      (await User.findOne({ email: user.email })) || (await createUser(user))

    await Session.findByIdAndUpdate(session._id, {
      ...session,
      userId: userFromDatabase._id
    })
  } catch (error) {
    console.log(error)
  }
}

const eventHandler = async session => {
  try {
    switch (session.provider) {
      case 'github':
        const user = await axios.get(`${GITHUB_API_URL}/user`, {
          headers: {
            authorization: `Bearer ${session.externalToken}`
          }
        })
        user.email = await axios.get(`${GITHUB_API_URL}/user/emails`, {
          headers: {
            authorization: `Bearer ${session.externalToken}`
          }
        }).then(response => response.data.find(item => item.primary).email)
        await handleUser(session, user.data)
        break
      default:
        break
    }
  } catch (error) {
    console.error(error)
  }
}

eventEmitter.on('OAuthUser', eventHandler)
