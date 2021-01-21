const bcrypt = require('bcrypt')

const authentication = (req, res, next) => {
let {username:formUsername, password:formPassword} = req.body
if (!formUsername) {
  formUsername = null
}
if (!formPassword) {
  formPassword = null
}

req.formUsername = formUsername
req.formPassword = formPassword
next()
};
module.exports = { authentication };
