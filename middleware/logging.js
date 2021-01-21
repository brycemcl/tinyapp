const { database } = require('./mockDatabase');

const logging = (req, res, next) => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  // console.log(database._urls)
  // console.log(database._usernames)
  // if (typeof req.session.username !== 'undefined') {
  //   console.log(req.session.username)
  // }
  // console.log(database);
  // const urls = database.getUrls("bryce")
  // console.log(database.numberOfVisitors(urls))
  // for (const key in urls) {
    // console.log(database._usernames)
    // console.log(database._urls)
    // database.numberOfVisitors("aaaZce")

  // }
  next();
};
module.exports = { logging };