const authentication = (req, res, next) => {
  let {username:formUsername, password:formPassword, shortUrl:formShortUrl, longUrl:formLongUrl} = req.body;
  if (!formUsername) {
    formUsername = undefined;
  }
  if (!formPassword) {
    formPassword = undefined;
  }
  if (!formShortUrl) {
    formShortUrl = undefined;
  }
  if (!formLongUrl) {
    formLongUrl = undefined;
  }

  req.formUsername = formUsername;
  req.formPassword = formPassword;
  req.formShortUrl = formShortUrl;
  req.formLongUrl = formLongUrl;
  next();
};
module.exports = { authentication };
