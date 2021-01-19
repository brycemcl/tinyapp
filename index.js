const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const HOSTNAME = process.env.HOSTNAME || "localhost"; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
    urls: urlDatabase,
    body: "../urls/body",
    head: "_empty",
  };
  res.render("partials/_shell", templateVars);
});

app.get("/:shortURL", (req, res) => {
  const templateVars = {
    title: req.params.shortURL,
    urls: urlDatabase,
    // body: "../urls/body",
    // head: "../urls/redirect/redirectHead",
    head: "_empty",
    body: "../urls/redirect/redirectHead",
    shortURL: req.params.shortURL,
  };
  res.render("partials/_shell", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    title: req.params.shortURL,
    urls: urlDatabase,
    body: "../urls/show/body",
    head: "_empty",
    shortURL: req.params.shortURL,
  };
  res.render("partials/_shell", templateVars);
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
