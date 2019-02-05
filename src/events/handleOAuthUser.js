'use strict'

const axios = require('axios')
const crypto = require('crypto')

const eventEmitter = require('./eventEmitter').default
const { Session, User } = require('../database/models').default

const createUser = async user => {
  const names = user.name.match(/\w+/)
  const firstName = names[0]
  const lastName = names.splice(0, 1).join(' ')

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
        const user = await axios.get('https://api.github.com/user', {
          headers: {
            authorization: `Bearer ${session.externalToken}`
          }
        })
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
