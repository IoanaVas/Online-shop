'use strict'

const { Product, Cart } = require('../../database/models').default

const action = async (req, res) => {
  const product = req.body
  const { cartId } = req.params

  try {
    const cart = await Cart.findOne({ _id: cartId })

    const item = cart.products.find(item => item.id === product.id)

    if (item) {
      await Cart.update({ 'products.id': product.id },
        { $set: { 'products.$.quantity': item.quantity + 1 } }
      )

      res.status(201).json({ data: 'Updated!' })
    } else {
      const result = await Product.findOne({ _id: product.id }, 'price')
      product['price'] = result.price

      try {
        cart.products.push(product)
        await cart.save()

        res.status(201).json({ data: 'Updated!' })
      } catch (error) {
        console.error(error)
        res.status(500).json({ error })
      }
    }
  } catch (error) {
    if (error.name === 'CastError') {
      console.error(error)
      res.status(403).json({ error: `The cart ${cartId} doesn't exist.` })
      return
    }
    console.error(error)
    res.status(500).json({ error })
  }
}

exports.default = action
