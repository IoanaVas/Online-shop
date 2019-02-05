'use strict'

const eventEmitter = require('./eventEmitter').default
const { Reset } = require('../database/models').default

const eventHandler = async (resetToken) => {
  try {
    await Reset.findOneAndRemove({ resetToken })
  } catch (error) {
    console.error(error)
  }
}

eventEmitter.on('changedPassword', eventHandler)
