'use strict'

const { User } = require('../../database/models').default
const { eventEmitter } = require('../../events').default

const action = async (req, res) => {
  const ids = req.query.ids.split(',')

  try {
    await User.deleteMany({ _id: { $in: ids } })
    eventEmitter.emit('deleteUsers', ids)

    res.status(200).json('Users successfully deleted!')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
