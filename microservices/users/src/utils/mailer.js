'use strict'

const nodemailer = require('nodemailer')

var sgTransport = require('nodemailer-sendgrid-transport')

const sendMail = async (email) => {
  const transporter = nodemailer.createTransport(sgTransport({
    auth: {
      api_user: 'ioanavasiliu',
      api_key: 'ioanavasiliu1'
    }
  }))

  const mailOptions = {
    from: 'fn@yahoo.com',
    to: email,
    subject: 'First Mail',
    text: 'This is the first mail.'
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

exports.default = sendMail
