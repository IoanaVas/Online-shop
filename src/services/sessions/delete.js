const { Session } = require('../../database/models')

const action = async (req, res) => {
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
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

exports.default = action
