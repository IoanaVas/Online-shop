'use strict'

const { User } = require('../../database/models').default
const { eventEmitter } = require('../../events').default

const action = async (req, res) => {
  const { ids } = req.body

  try {
    await User.deleteMany({ _id: { $in: ids } })
    eventEmitter.emit('deleteUsers', ids)

    res.status(200).json({ data: 'Users successfully deleted!' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Wrong format' })
    } else {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong...' })
    }
  }
}

exports.default = action
