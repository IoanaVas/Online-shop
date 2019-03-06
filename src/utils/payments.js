'use strict'

const { STRIPE_SECRET_KEY } = require('../../secrets.json')
const { User } = require('../database/models').default

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const getStripeToken = async (req, res, next) => {
  const {
    number,
    expMonth,
    expYear,
    cvc
  } = req.body

  try {
    const token = await stripe.tokens.create({
      card: {
        number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc
      }
    })
    req.body.token = token
    next()
  } catch (err) {
    if (err.type === 'StripeCardError') {
      res.status(402).json({ error: err.message })

      return
    } else if (err.type === 'StripeInvalidRequestError') {
      res.status(400).json({ error: err.message })

      return
    }
    console.error(err)

    res.status(500).json({ error: 'Oops, something went wrong...' })
  }
}

const createStripeCustomer = async (req, res, next) => {
  const { token } = req.body
  let { user } = req

  if (!user.stripeId) {
    try {
      const customer = await stripe.customers.create({
        source: token.id,
        email: user.email
      })

      user = await User.findByIdAndUpdate(
        { _id: user._id },
        { stripeId: customer.id },
        { new: true }
      )

      req.user = user
      next()
    } catch (err) {
      console.error(err)

      res.status(500).json({ error: 'Oops, something went wrong...' })
    }
  }
  next()
}

exports.default = {
  getStripeToken,
  createStripeCustomer
}
