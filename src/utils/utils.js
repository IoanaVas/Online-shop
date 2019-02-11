'use strict'

const emailRegex = /^[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*[@][a-z]+[.][a-z]+$/
const databasePasswordRegex = /^[a-z0-9]{64}$/
const clientPasswordRegex = /^[a-zA-Z0-9._]{8,}$/
const priceRegex = /^(0|[1-9][0-9]{0,2})(,[0-9]{3})*([.][0-9]{1,2})*[ ]([$€£]|RON)$/

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

const routeByQueryParameter = list => (req, res, next) => {
  const result = list.find(item => {
    item.params.every(parameter => req.query[parameter])
  }
  )

  if (result) {
    let index = 0
    const nextInList = () => {
      index++
      console.log('index', index)
      result.actions[index](req, res, nextInList)
    }
    result.actions[index](req, res, nextInList)
  } else {
    next()
  }
}

const checkUserPermission = (User, Session) => async (req, res, next) => {
  const { user } = req

  if (user.permission === 'admin') next()
  else res.status(403).json({ error: 'No permission' })
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

const validate = (variabileName, value, regex) => {
  if (!value || (value && !regex.test(value))) {
    const error = `${variabileName} is invalid\n`
    return error
  }
  return ''
}

exports.default = {
  emailRegex,
  databasePasswordRegex,
  clientPasswordRegex,
  priceRegex,
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter,
  checkUserPermission,
  stripProperties,
  validate
}
