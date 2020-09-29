// express server
// start with npm start
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');

//enables local host
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//stores urls
const urlDatabase = {
  'b2xvn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

//function for encoded string
const generateRandomString = () => {
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 6);
};

//posts

app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls/${key}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const key = req.params.shortURL;
  delete urlDatabase[key];
  res.redirect("/urls")
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const key = req.params.shortURL;
  urlDatabase[key] = req.body.longURL
  res.redirect("/urls")
});

app.post("/urls/:shortURL/change", (req, res) => {
  const key = req.params.shortURL;
  res.redirect(`/urls/${key}`);
});

app.post("/login", (req, res) => {
  const username = req.body.username
  res.cookie('username', username);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//pages

app.get('/urls', (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase, };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


