const authorization = (req, res, next) => {
  if (req.session.username !== undefined) {
    next()
  } else {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Login required",
    };
    res.render("partials/_shell", templateVars);
  }
};
module.exports = { authorization };
