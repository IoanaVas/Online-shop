'use strict'

const emailRegex = /^[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*[@][a-z]+[.][a-z]+$/
const databasePasswordRegex = /^[a-z0-9]{64}$/
const clientPasswordRegex = /^[a-zA-Z0-9._]{8,}$/

const findUserByToken = (User, Session) => async accessToken => {
  try {
    const session = await Session.findOne({ accessToken })
    const user = await User.findById(session.userId)
    return user
  } catch (error) {
    return null
  }
}

exports.default = {
  emailRegex,
  databasePasswordRegex,
  clientPasswordRegex,
  findUserByToken
}
