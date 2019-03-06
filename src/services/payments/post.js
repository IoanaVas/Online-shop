'use strict'

const { STRIPE_SECRET_KEY } = require('../../../secrets.json')
const { eventEmitter } = require('../../events').default

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const action = async (req, res) => {
  const { user, cart } = req

  try {
    const charge = await stripe.charges.create({
      amount: cart.payment,
      currency: 'usd',
      customer: user.stripeId
    })

    await eventEmitter.emit('deleteProducts', cart)
    await eventEmitter.emit('deleteCart', cart)
    res.status(201).json({ data: charge })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
