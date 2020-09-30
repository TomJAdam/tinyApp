//   *** TinyApp Server ***
// ** start with npm start **

const express = require('express');
const cookieParser = require('cookie-parser');

// Server Setup
const app = express();
const PORT = 8080;

// Middleware
app.use(cookieParser());
const bodyParser = require("body-parser");
// const { response } = require('express');
app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');

// Enables Local Host
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Stores Users URLS
const urlDatabase = {
  'b2xvn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

// Stores User Info
const userDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
};

//* FUNCTIONS *

// Creates Encoded String
const generateRandomString = () => {
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 6);
};

// Checks for existing email
const keyCheck = (key, email, data) => {
  for (let da in data) {
    if (data[da][key] === email) {
      return true;
    }
  }
};

// Returns random ID from email
const findIdFromEmail = (email, data) => {
  for (let da in data) {
    if (data[da].email === email) {
      return da
    }
  }
};

// Actions
//* Ask mentor about organizing this code *


app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls/${key}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const key = req.params.shortURL;
  delete urlDatabase[key];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const key = req.params.shortURL;
  urlDatabase[key] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/change", (req, res) => {
  const key = req.params.shortURL;
  res.redirect(`/urls/${key}`);
});

app.post("/login", (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!keyCheck('email', email, userDatabase)) {
    res.status(403).json({ message: '403, email not found'})
  } else if (keyCheck('email', email, userDatabase) && !keyCheck('password', password, userDatabase)) {
    res.status(403).json({ message: '403, password does not match email'})
  } else if (keyCheck('email', email, userDatabase) && keyCheck('password', password, userDatabase)) {
      res.cookie('userID', findIdFromEmail(email, userDatabase));
      res.redirect(`/urls`);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  let userID = generateRandomString();

  if (!keyCheck('email', req.body.email, userDatabase)) {
    userDatabase[userID] = {
      id: userID,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie('userID', userID);
    res.redirect('/urls');
  } else {
    res.status(400).json({ message: '400, email already exists'});
  }
});

// Routes

app.get('/urls', (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']], urls: urlDatabase, };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']] };
  res.render("user_registration", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']] };
  res.render("user_login", templateVars);
});




