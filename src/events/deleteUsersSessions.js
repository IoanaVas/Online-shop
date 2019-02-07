'user strict'

const eventEmitter = require('./eventEmitter').default

const { Session } = require('../database/models').default

const eventHandler = async (ids) => {
  try {
    await Session.deleteMany({ userId: { $in: ids } })
  } catch (error) {
    console.error(error)
  }
}

eventEmitter.on('deleteUsers', eventHandler)
