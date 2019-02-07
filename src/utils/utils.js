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

const checkUserPermissions = User => async (req, res, next) => {
  const accessToken = req.headers.authorization

  try {
    const user = await User.findOne({ accessToken })
    if (user.permission === 'admin') next()
    else res.status(403).json({ error: 'No permission' })
  } catch (error) {
    console.error(error)
  }
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

const routeByQueryParameter = list => (req, res, next) => {
  let index = 0
  const nextInList = () => {
    index++
    list.actions[index](req, res, nextInList)
  }
  const result = list.find(item =>
    item.params.every(parameter => req.query[parameter])
  )

  result ? result.actions[index](action => action(req, res, nextInList)) : next()
}

const stripProperties = (properties, object) => {
  let newObject = {}
  Object.keys(object).forEach(key => {
    newObject = {
      ...newObject,
      ...(!properties.find(element => element === key) && { [key]: object[key] })
    }
  })
  return newObject
}

exports.default = {
  emailRegex,
  databasePasswordRegex,
  clientPasswordRegex,
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter,
  stripProperties,
  checkUserPermissions
}
