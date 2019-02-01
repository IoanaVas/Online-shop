'use strict'

const shortId = require('shortid')

const { User, Reset } = require('../../models').default
const { sendMail } = require('../../utils').default

const postResets = async (req, res) => {
  const email = req.body.email
  const resetToken = shortId.generate()

  if (!email) {
    res.status(400).json({ error: 'No email' })
    return
  }

  try {
    if (await User.findOne({ email })) {
      const reset = await Reset.create({ resetToken, email })
      await sendMail(email)
      res.status(201).json({ data: reset })
    } else {
      res.status(404).json({ error: 'Email not found' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

exports.default = postResets
