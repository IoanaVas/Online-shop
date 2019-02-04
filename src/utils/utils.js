'use strict'

const emailRegex = /^[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*[@][a-z]+[.][a-z]+$/
const databasePasswordRegex = /^[a-z0-9]{64}$/
const clientPasswordRegex = /^[a-zA-Z0-9._]{8,}$/

const checkIfAuthorized = Session => async (req, res, next) => {
  const session = await Session.findOne({
    accessToken: req.headers.authorization
  })
  if (session) next()
  else res.status(400).json({ error: 'Unauthorized' })
}

const retrieveUserByToken = (User, Session) => async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization
    const session = await Session.findOne({ accessToken })
    const user = await User.findById(session.userId)

    if (user) {
      req.user = user
      next()
    } else {
      req.user = null
      next()
    }
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

const routeByQueryParameter = list => (req, res) =>
  list
    .find(item => item.params.every(parameter => req.query[parameter]))
    .action(req, res)

exports.default = {
  emailRegex,
  databasePasswordRegex,
  clientPasswordRegex,
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter
}
