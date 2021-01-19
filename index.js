const express = require("express");
const app = express();
const { uniqueURL } = require("./uniqueURL");
const PORT = process.env.PORT || 8080; // default port 8080
const HOSTNAME = process.env.HOSTNAME || "localhost"; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  _urls: {
    sample: {
      b2xVn2: "http://www.lighthouselabs.ca",
      "9sm5xK": "http://www.google.com",
    },
  },
  urls(userName = "sample") {
    return this._urls[userName];
  },
  newURL(longURL, userName = "sample") {
    const shortURL = uniqueURL();
    if (!longURL.includes("http://") || !longURL.includes("http://")) {
      longURL = "http://" + longURL;
    }
    this["_urls"][userName][shortURL] = longURL;
    return shortURL;
  },
  deleteURL(shortURL, userName = "sample") {
    const urls = this.urls();
    delete urls[shortURL];
    console.log(this.urls());
  },
};

app.get("/", (req, res) => {
  const templateVars = {
    title: "",
    body: "../body",
    head: "_empty",
  };
  res.render("partials/_shell", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    title: "URLs",
    urls: urlDatabase.urls(),
    body: "../urls/body",
    head: "_empty",
  };
  res.render("partials/_shell", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    title: req.params.shortURL,
    urls: urlDatabase.urls(),
    body: "../urls/new/body",
    head: "_empty",
    shortURL: req.params.shortURL,
  };
  res.render("partials/_shell", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = urlDatabase.newURL(longURL);
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  urlDatabase.deleteURL(shortURL);
  res.redirect(`/urls/`);
});

app.get("/:shortURL", (req, res) => {
  const templateVars = {
    title: req.params.shortURL,
    urls: urlDatabase.urls(),
    head: "_empty",
    body: "../urls/redirect/redirectHead",
    shortURL: req.params.shortURL,
  };
  res.render("partials/_shell", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    title: req.params.shortURL,
    urls: urlDatabase.urls(),
    body: "../urls/show/body",
    head: "_empty",
    shortURL: req.params.shortURL,
  };
  res.render("partials/_shell", templateVars);
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
