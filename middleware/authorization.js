const {database} = require('./mockDatabase')
const authorization = (req, res, next) => {
  if (req.session.username === undefined ) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Login required",
    };
    res.render("partials/_shell", templateVars);
  } else if(database.validNewUsername(req.session.username)){
    res.redirect(`/logout`);
    return
  } else {
    next()
  }
};
module.exports = { authorization };
