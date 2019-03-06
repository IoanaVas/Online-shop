'use strict'

const emailRegex = /^[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*[@][a-z]+[.][a-z]+$/
const databasePasswordRegex = /^[a-z0-9]{64}$/
const clientPasswordRegex = /^[a-zA-Z0-9._]{8,}$/
const extensionRegex = /\.[0-9a-z]+$/

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
      res.end(400).json({ error: 'Auth token not associated with any user' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).end({ error: 'Something went wrong...' })
  }
}

const routeByQueryParameter = list => (req, res, next) => {
  const result = list.find(item =>
    item.params.every(parameter => req.query[parameter])
  )

  if (result) {
    let index = 0
    const nextInList = () => {
      index++
      result.actions[index](req, res, nextInList)
    }
    result.actions[index](req, res, nextInList)
  } else {
    next()
  }
}

const checkUsersAreEqual = async (req, res, next) => {
  const { user } = req
  const { id } = req.params

  if (user._id.toString() === id) {
    next()
  } else {
    res.status(403).json({ error: 'No permission' })
  }
}

const checkUserPermission = async (req, res, next) => {
  const { user } = req

  if (user.permission === 'admin') next()
  else res.status(403).json({ error: 'No permission' })
}

const routeNotFound = (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` })
}

const stripProperties = (properties, object) => {
  let newObject = {}
  Object.keys(object).forEach(key => {
    newObject = {
      ...newObject,
      ...(!properties.find(element => element === key) && {
        [key]: object[key]
      })
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

const checkProduct = (Product) => async (req, res, next) => {
  let product = req.body
  const { cart } = req

  try {
    const productFromInventory = await Product.findById(product.id)
    req.productFromInventory = productFromInventory

    const cartProduct = cart.products.find(item => item.id === product.id)

    const totalQuantity = cartProduct ? (product.quantity + cartProduct.quantity) : product.quantity

    if (productFromInventory.quantity >= totalQuantity) {
      product.quantity = totalQuantity
      next()
      return
    }

    res.status(400).json({ error: 'Not enough products in the inventory.' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(403).json({ error: `The product with the id ${product.id} was not found.` })
      return
    }
    res.status(500).json({ error })
  }
}

const calculatePrice = (cart) => {
  let total = 0

  cart.products.map(product => {
    total += product.price * product.quantity
  })

  return total
}

const getCart = (Cart) => async (req, res, next) => {
  const { user } = req

  try {
    const result = await Cart.findOne({ userId: user._id })
    req.cart = result
    next()
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ Error: `The cart with the id given doesn't exist.` })
    }
    res.status(500).json({ Error: `Oops, something went wrong...` })
  }
}

exports.default = {
  emailRegex,
  databasePasswordRegex,
  clientPasswordRegex,
  extensionRegex,
  checkIfAuthorized,
  retrieveUserByToken,
  routeByQueryParameter,
  checkUsersAreEqual,
  checkUserPermission,
  routeNotFound,
  stripProperties,
  validate,
  checkProduct,
  calculatePrice,
  getCart
}
