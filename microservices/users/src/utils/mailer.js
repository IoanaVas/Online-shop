'use strict'

const nodemailer = require('nodemailer')

// var sgTransport = require('nodemailer-sendgrid-transport')

const sendMail = async (email) => {
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
    subject: 'First Mail',
    text: 'This is the first mail.'
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email was send!')
  } catch (error) {
    console.log(error)
  }
}

exports.default = sendMail
