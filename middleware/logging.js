const { database } = require('./mockDatabase');

const logging = (req, res, next) => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  // console.log(database._urls)
  // console.log(database._usernames)
  // if (typeof req.session.username !== 'undefined') {
  //   console.log(req.session.username)
  // }
  // console.log(database);
  next();
};
module.exports = { logging };