'use strict'

const nodemailer = require('nodemailer')

const RESET_LINK = require('../../config.json').RESET_LINK

const sendMail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ioana.vasiliu1995@gmail.com',
      pass: 'ioana0401'
    }
  })

  const mailOptions = {
    to: email,
    subject: 'Change Password',
    text: 'Hello! If you forgot your password and would like to set a new one ' +
    `please follow the link: ${RESET_LINK}?resetToken=${resetToken}.`
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('The reset email was send!')
  } catch (error) {
    console.log(error)
  }
}

exports.default = sendMail
