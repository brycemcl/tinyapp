const { authentication } = require("./middleware/authentication");
const { authorization } = require("./middleware/authorization");
const { database } = require("./middleware/mockDatabase");
const { dumpDatabase } = require("./middleware/dumpDatabase");
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const SECRET = process.env.SECRET || uniqueURL(45)
app.use(
  cookieSession({
    name: "session",
    keys: [SECRET],
    maxAge: 24 * 60 * 60 * 1000 * 365, // year
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(authentication);
app.use(dumpDatabase);


/*
Catchall for if a user types in a wrong route then gets routed to the tracking
*/
app.get("/undefined", (req, res) => {
  if (req.session.username !== undefined) {
    res.redirect(`/urls`);
  } else {
    res.redirect(`/login`);
  }
});

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
GET /urls/:shortUrl

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
app.get("/urls/:shortUrl", authorization, (req, res) => {
  if (
    database.getUrls(req.session.username).hasOwnProperty(req.params.shortUrl)
  ) {
    const templateVars = {
      title: "",
      body: "../pages/urlDetails",
      head: "_empty",
      shortUrl: req.params.shortUrl,
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
  const longUrl = req.body.longUrl;
  const shortUrl = database.newURL(longUrl, req.session.username);
  res.redirect(`/urls/${shortUrl}`);
});




app.get("/urls/:shortUrl/edit", authorization, (req, res) => {
  if (
    database.getUrls(req.session.username).hasOwnProperty(req.params.shortUrl)
  ) {
    const templateVars = {
      title: "",
      body: "../pages/urlEdit",
      head: "_empty",
      shortUrl: req.params.shortUrl,
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
POST /urls/:id

if user is logged in and owns the URL for the given ID:
updates the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message
*/
app.post("/urls/:previousShortUrl",authorization, (req, res) => {
  if (
    database.getUrls(req.session.username).hasOwnProperty(req.params.previousShortUrl)
  ) {
    let newShortUrl = req.params.previousShortUrl
if (typeof req.formShortUrl !== "undefined" && database.validNewUrl(req.formShortUrl)) {
  newShortUrl = database.renameShortUrl(req.session.username, req.params.previousShortUrl, req.formShortUrl)
}
if (req.formLongUrl) {
  database.renameLongUrl(req.session.username, newShortUrl, req.formLongUrl)
}
res.redirect(`/urls/${newShortUrl}`);
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
POST /urls/:id/delete
if user is logged in and owns the URL for the given ID:
deletes the URL
redirects to /urls
if user is not logged in:
(Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
(Minor) returns HTML with a relevant error message
*/
app.post("/urls/:shortUrl/delete",authorization, (req, res) => {
  if(database.deleteUrl(req.params.shortUrl, req.session.username)){
    res.redirect(`/urls/`)
  }else{
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

app.get("/urls/:shortUrl/:fp/track", (req, res) => {
  if (database.visit(req.params.shortUrl, req.params.fp)) {
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
app.get("/:shortUrl", (req, res) => {
  if (typeof req.params.shortUrl !== "undefined") {
    const templateVars = {
      title: "",
      body: "../partials/_redirect",
      head: "_empty",
      shortUrl: req.params.shortUrl,
      longUrl: database.getURL(req.params.shortUrl),
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

app.get("/u/:shortUrl", (req, res) => {
  if (typeof req.params.shortUrl !== "undefined") {
    const templateVars = {
      title: "",
      body: "../partials/_redirect",
      head: "_empty",
      shortUrl: req.params.shortUrl,
      longUrl: database.getURL(req.params.shortUrl),
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

/*
Catchall for if a user types in a wrong route
*/
app.get("*", (req, res) => {
  if (req.session.username !== undefined) {
    res.redirect(`/urls`);
  } else {
    res.redirect(`/login`);
  }
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
