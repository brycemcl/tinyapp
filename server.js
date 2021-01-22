const { authentication } = require("./middleware/authentication");
const { authorization } = require("./middleware/authorization");
const { database } = require("./middleware/mockDatabase");
// const { uniqueURL } = require("./middleware/uniqueURL");
const { logging } = require("./middleware/logging");
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
// const { request } = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const HOSTNAME = process.env.HOSTNAME || "localhost"; // default port 8080
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SECRET],
    maxAge: 24 * 60 * 60 * 1000 * 365, // year
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(logging);
app.use(authentication);

/*
GET /login

if user is logged in:
(Minor) redirects to /urls
if user is not logged in:
returns HTML with:
a form which contains:
input fields for email and password
submit button that makes a POST request to /login
*/
app.get("/login", (req, res) => {
  const templateVars = {
    title: "",
    body: "../pages/login",
    head: "_empty",
  };
  res.render("partials/_shellLogin", templateVars);
});

/*
POST /login

if email and password params match an existing user:
sets a cookie
redirects to /urls
if email and password params don't match an existing user:
returns HTML with a relevant error message
*/
app.post("/login", async (req, res) => {
  if (!req.formPassword) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Need a password",
    };
    res.render("partials/_shellLogin", templateVars);
  } else if (!req.formUsername) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Need a username",
    };
    res.render("partials/_shellLogin", templateVars);
  } else if (database.validNewUsername(req.formUsername)) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Invalid username or password",
    };
    res.render("partials/_shellLogin", templateVars);
  } else if (
    bcrypt.compareSync(
      req.formPassword,
      database.getPasswordHash(req.formUsername)
    )
  ) {
    req.session.username = req.formUsername;
    res.redirect(`/urls`);
  } else {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Invalid username or password",
    };
    res.render("partials/_shellLogin", templateVars);
  }
});

/*
POST /register

if email or password are empty:
returns HTML with a relevant error message
if email already exists:
returns HTML with a relevant error message
otherwise:
creates a new user
encrypts the new user's password with bcrypt
sets a cookie
redirects to /urls
*/
app.post("/register", (req, res) => {
  if (
    database.validNewUsername(req.formUsername) &&
    database.validNewPassword(req.formPassword)
  ) {
    const hashedPassword = bcrypt.hashSync(req.formPassword, 10);
    database.addUsername(req.formUsername, hashedPassword);
    req.session.username = req.formUsername;
    res.redirect(`/urls`);
  } else if (!req.formPassword) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Need a password",
    };
    res.render("partials/_shellLogin", templateVars);
  } else if (!req.formUsername) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Need a username",
    };
    res.render("partials/_shellLogin", templateVars);
  } else if (!database.validNewUsername(req.formUsername)) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Choose another username",
    };
    res.render("partials/_shellLogin", templateVars);
  } else if (!database.validNewPassword(req.formPassword)) {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "Invalid password",
    };
    res.render("partials/_shellLogin", templateVars);
  }
});

/*
GET /

if user is logged in:
(Minor) redirect to /urls
if user is not logged in:
(Minor) redirect to /login
*/
app.get("/", (req, res) => {
  if (req.session.username !== undefined) {
    res.redirect(`/urls`);
  } else {
    res.redirect(`/login`);
  }
});

/*
GET /urls

if user is logged in:
returns HTML with:
the site header (see Display Requirements above)
a list (or table) of URLs the user has created, each list item containing:
a short URL
the short URL's matching long URL
an edit button which makes a GET request to /urls/:id
a delete button which makes a POST request to /urls/:id/delete
(Stretch) the date the short URL was created
(Stretch) the number of times the short URL was visited
(Stretch) the number number of unique visits for the short URL
(Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new
if user is not logged in:
returns HTML with a relevant error message
*/
app.get("/urls", authorization, (req, res) => {
  const templateVars = {
    title: "",
    body: "../pages/urlList",
    head: "_empty",
    username: req.session.username,
    urls: database.getUrls(req.session.username),
  };
  res.render("partials/_shell", templateVars);
});

/*
GET /urls/new

if user is logged in:
returns HTML with:
the site header (see Display Requirements above)
a form which contains:
a text input field for the original (long) URL
a submit button which makes a POST request to /urls
if user is not logged in:
redirects to the /login page
*/
app.get("/urls/new", authorization, (req, res) => {
  const templateVars = {
    title: "",
    body: "../pages/newUrl",
    head: "_empty",
    username: req.session.username,
  };
  res.render("partials/_shell", templateVars);
});

/*
GET /urls/:shortURL

if user is logged in and owns the URL for the given ID:
returns HTML with:
the site header (see Display Requirements above)
the short URL (for the given ID)
a form which contains:
the corresponding long URL
an update button which makes a POST request to /urls/:id
(Stretch) the date the short URL was created
(Stretch) the number of times the short URL was visited
(Stretch) the number of unique visits for the short URL
if a URL for the given ID does not exist:
(Minor) returns HTML with a relevant error message
if user is not logged in:
returns HTML with a relevant error message
if user is logged it but does not own the URL with the given ID:
returns HTML with a relevant error message
*/
app.get("/urls/:shortURL", authorization, (req, res) => {
  if (
    database.getUrls(req.session.username).hasOwnProperty(req.params.shortURL)
  ) {
    const templateVars = {
      title: "",
      body: "../pages/urlDetails",
      head: "_empty",
      shortURL: req.params.shortURL,
      urls: database.getUrls(req.session.username),
      username: req.session.username,
    };
    res.render("partials/_shell", templateVars);
  } else {
    const templateVars = {
      title: "",
      body: "../pages/urlList",
      head: "_empty",
      errorType: "URL does not exist",
      username: req.session.username,
      urls: database.getUrls(req.session.username),
    };
    res.render("partials/_shell", templateVars);
  }
});

/*
POST /urls

if user is logged in:
generates a short URL, saves it, and associates it with the user
redirects to /urls/:id, where :id matches the ID of the newly saved URL
if user is not logged in:
(Minor) returns HTML with a relevant error message
*/
app.post("/urls", authorization, (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = database.newURL(longURL, req.session.username);
  res.redirect(`/urls/${shortURL}`);
});

/*
POST /urls/:id

if user is logged in and owns the URL for the given ID:
updates the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message
*/
app.post("/urls/:id", (req, res) => {});

/*
POST /urls/:id/delete
if user is logged in and owns the URL for the given ID:
deletes the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message
*/
app.post("/urls/:id/delete", (req, res) => {});

/*
GET /register

if user is logged in:
(Minor) redirects to /urls
if user is not logged in:
returns HTML with:
a form which contains:
input fields for email and password
a register button that makes a POST request to /register
*/
app.get("/register", (req, res) => {
  const templateVars = {
    title: "",
    body: "_empty",
    head: "_empty",
    username: req.session.username,
  };
  res.render("partials/_shell", templateVars);
});

app.get("/urls/:shortURL/:fp/track", (req, res) => {
  // console.log("tracking link")
  // console.log(req.params.shortURL)
  // console.log(database.getURL(req.params.shortURL))
  console.log(database.numberOfVisitors(req.params.shortURL));
  database.visit(req.params.shortURL, req.params.fp);
  // console.log(database.numberOfVisitors(req.params.shortURL))
  //typeof this._usernames[newUsername] === "undefined"
  // console.log(req.params.fp)
  if (database.getURL(req.params.shortURL)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

/*
POST /logout

deletes cookie
redirects to /login
*/
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

/*
GET /:id

if URL for the given ID exists:
redirects to the corresponding long URL
if URL for the given ID does not exist:
(Minor) returns HTML with a relevant error message
*/
app.get("/:shortURL", (req, res) => {
  if (typeof req.params.shortURL !== "undefined") {
    const templateVars = {
      title: "",
      body: "../partials/_redirect",
      head: "_empty",
      shortURL: req.params.shortURL,
      longURL: database.getURL(req.params.shortURL),
    };
    res.render("partials/_emptyShell", templateVars);
  } else {
    const templateVars = {
      title: "",
      body: "../pages/login",
      head: "_empty",
      errorType: "URL does not exist",
    };
    res.render("partials/_shellLogin", templateVars);
  }
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
