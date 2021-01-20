const { authentication } = require("./middleware/authentication");
const { authorization } = require("./middleware/authorization");
const { mockDatabase } = require("./middleware/mockDatabase");
const { uniqueURL } = require("./middleware/uniqueURL");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const HOSTNAME = process.env.HOSTNAME || "localhost"; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.SECRET) {
  app.use(cookieParser(process.env.SECRET));
} else {
  app.use(cookieParser());
}

app.set("view engine", "ejs");
app.use(authentication);

/*
GET /

if user is logged in:
(Minor) redirect to /urls
if user is not logged in:
(Minor) redirect to /login
*/
app.get("/", (req, res) => {
  console.log(req.user);
  if (req.user !== undefined) {
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
app.get("/urls", (req, res) => {
  const templateVars = {
    title: "",
    body: "_empty",
    head: "_empty",
  };
  res.render("partials/_shell", templateVars);
});

/*

*/
app.get("/urls/new", (req, res) => {
  const templateVars = {
    title: "",
    body: "_empty",
    head: "_empty",
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
app.get("/urls/new", (req, res) => {
  const templateVars = {
    title: "",
    body: "_empty",
    head: "_empty",
  };
  res.render("partials/_shell", templateVars);
});

/*
GET /urls/:id

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
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    title: "",
    body: "_empty",
    head: "_empty",
  };
  res.render("partials/_shell", templateVars);
});

/*
GET /u/:id

if URL for the given ID exists:
redirects to the corresponding long URL
if URL for the given ID does not exist:
(Minor) returns HTML with a relevant error message
*/
app.get("/u/:id", (req, res) => {
  const templateVars = {
    title: "",
    body: "_empty",
    head: "_empty",
  };
  res.render("partials/_shell", templateVars);
});

/*
POST /urls

if user is logged in:
generates a short URL, saves it, and associates it with the user
redirects to /urls/:id, where :id matches the ID of the newly saved URL
if user is not logged in:
(Minor) returns HTML with a relevant error message
*/
app.post("/urls", (req, res) => { });

/*
POST /urls/:id

if user is logged in and owns the URL for the given ID:
updates the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message
POST /urls/:id/delete
if user is logged in and owns the URL for the given ID:
deletes the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message
*/
app.post("/urls/:id", (req, res) => { });

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
  res.render("partials/_shell", templateVars);
});

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
  };
  res.render("partials/_shell", templateVars);
});

/*
POST /login

if email and password params match an existing user:
sets a cookie
redirects to /urls
if email and password params don't match an existing user:
returns HTML with a relevant error message
*/
app.post("/login", (req, res) => { });

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
app.post("/register", (req, res) => { });

/*
POST /logout

deletes cookie
redirects to /urls
*/
app.post("/logout", (req, res) => { });

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
