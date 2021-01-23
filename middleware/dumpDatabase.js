const {database} = require('./databases/emptyDatabase');
const dumpDatabase = (req, res, next) => {
  next();
  if (!process.env.NODE_ENV === "production") {
    console.log(JSON.stringify({urls:{...database._urls}, usernames:{...database._usernames}}));
  }
};
module.exports = { dumpDatabase };