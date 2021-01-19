const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  const templateVars = {};
  res.render("index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    title: "test",
    urls: urlDatabase,
    body: "../urls/body",
  };
  res.render("partials/shell", templateVars);
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
