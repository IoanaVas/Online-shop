'use strict'

const emailRegex = /^[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*[@][a-z]+[.][a-z]+$/
const passwordRegex = /^[a-z0-9]{64}$/

exports.default = {
  emailRegex,
  passwordRegex
}
