'use strict'

const { Router } = require('express')

const {
  getUsers,
  getUserById,
  postUser,
  deleteUser
} = require('./methods').default
const { Session } = require('./models').default

const router = Router()

const routeByQueryParameter = list =>
  (req, res) =>
    list.find(item =>
      item.params.every(parameter => req.query[parameter])
    ).action(req, res)

const checkIfAuthorized = async (req, res, next) => {
  const session = await Session.findOne({
    accessToken: req.headers.authorization
  })
  if (session) next()
  else res.status(400).json({ error: 'Unauthorized' })
}

router.get('/', routeByQueryParameter([
  { params: ['id'], action: getUserById },
  { params: [], action: getUsers }
]))
router.post('/', postUser)
router.delete('/', checkIfAuthorized, deleteUser)

exports.default = router
