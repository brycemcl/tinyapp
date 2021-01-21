const bcrypt = require('bcrypt')
const mockDatabase = require('./mockDatabase')

const authentication = (req, res, next) => {
const method = req.method
const url  = req.originalUrl
const cookieUsername = req.cookies.user ? req.cookies.user: null
let {username:formUsername, password:formPassword, cookieExpires:formCookieExpires = null} = req.body
if (!formUsername) {
  formUsername = null
}
if (!formPassword) {
  formPassword = null
}
if (formCookieExpires !== true) {
  formCookieExpires = false
}
req.cookieUsername = cookieUsername
req.formUsername = formUsername
req.formPassword = formPassword
req.formCookieExpires = formCookieExpires
next()
};
module.exports = { authentication };
