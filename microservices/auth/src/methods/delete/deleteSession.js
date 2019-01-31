const { Session } = require('../../models')

const deleteSession = async (req, res) => {
  const userId = req.query.id
  const accessToken = req.body.accessToken

  if (!accessToken) {
    res.status(400).json({ error: 'Access token missing.' })
    return
  }

  try {
    if (await Session.find({ accessToken })) {
      await Session.deleteOne({ userId })
      res.status(200).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = deleteSession
