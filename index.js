const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  const templateVars = {
    title: "",
    body: "../body",
    head: "empty",
  };
  res.render("partials/shell", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    title: "URLs",
    urls: urlDatabase,
    body: "../urls/body",
    head: "empty",
  };
  res.render("partials/shell", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    title: req.params.shortURL,
    urls: urlDatabase,
    body: "../urls/body",
    head: "../urls/redirect/redirectHead",
    shortURL: req.params.shortURL
  };
  res.render("partials/shell", templateVars);
  console.log(templateVars);
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
