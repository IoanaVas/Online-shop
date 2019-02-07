'use strict'

const { User } = require('../../database/models').default

const action = async (req, res) => {
  const { ids } = req.query
  console.log('ids', typeof ids)

  try {
    User.deleteMany({ userId: { $in: ids } })
    res.status(200).json('Users successfully deleted!')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
