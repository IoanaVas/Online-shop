const { Session } = require('../../models')

const deleteSession = async (req, res) => {
  const accessToken = req.headers['authorization']

  if (!accessToken) {
    res.status(400).json({ error: 'Access token missing.' })
    return
  }

  try {
    if (await Session.find({ accessToken })) {
      await Session.deleteOne({ accessToken })
      res.status(200).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = deleteSession
