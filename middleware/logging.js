const { database } = require('./mockDatabase');

const logging = (req, res, next) => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  if (typeof req.session.username !== 'undefined') {
    console.log(req.session.username)
  }
  console.log(database);
  next();
};
module.exports = { logging };