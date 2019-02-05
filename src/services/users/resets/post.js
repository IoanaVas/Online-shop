'use strict'

const shortId = require('shortid')

const { User, Reset } = require('../../../database/models').default
const { sendEmail } = require('../../../utils').default

const action = async (req, res) => {
  const email = req.body.email
  const resetToken = shortId.generate()

  if (!email) {
    res.status(400).json({ error: 'No email' })
    return
  }

  try {
    if (await User.findOne({ email })) {
      const reset = await Reset.create({ resetToken, email })
      await sendEmail(email, resetToken)
      res.status(201).json({ data: reset })
    } else {
      res.status(404).json({ error: 'No user with the given email was found.' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = action
