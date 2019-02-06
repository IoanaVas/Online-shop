'use strict'

const crypto = require('crypto')

const { User, Reset } = require('../../database/models').default
const { eventEmitter } = require('../../events').default

const action = async (req, res) => {
  const { resetToken, newPassword } = req.body

  try {
    if (resetToken) {
      const reset = await Reset.findOne({ resetToken })

      if (reset) {
        const { email } = reset
        const password = crypto.createHash('sha256').update(newPassword).digest('hex')

        await User.findOneAndUpdate({ email }, { password })
        await eventEmitter.emit('changedPassword', resetToken)

        res.status(200).json({ data: 'Password successfuly changed!' })
      } else {
        res.status(400).json({ error: "Reset request doesn't exist" })
      }
    } else {
      res.status(400).json({ error: 'No reset request token was provided' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = action
