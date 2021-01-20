const bcrypt = require('bcrypt')
const mockDatabase = require('./mockDatabase')

const authentication = (req, res, next) => {
console.log(req.cookies)
  next()
};
module.exports = { authentication };
