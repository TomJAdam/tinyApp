//   *** TinyApp Server ***
// ** start with npm start **

const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

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
  // 'b2xvn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'b2xvn2' },
  // '9sm5xk': { longURL: 'http://www.google.com', userID: 'b2xvn2' },
};

// Stores User Info
const userDatabase = {
  // "userRandomID": {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur"
  // },
};

//* FUNCTIONS *

// Creates Encoded String
const generateRandomString = () => {
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 6);
};

// Checks for a value in a key within the data structure ('string', value, object)
const keyCheck = (key, val, data) => {
  for (let da in data) {
    if (data[da][key] === val) {
      return data[da][key];
    }
  }
};

// Returns ID from email (user email, 'string', object)
const findKeyFromEmail = (email, key, data) => {
  for (let da in data) {
    if (data[da].email === email) {
      return data[da][key];
    }
  }
};

// loads user specific urls (cookies, urldatabase)
const urlsForUser = (id, data) => {
  let result = {}
  for (let da in data) {
    if (data[da].userID === id) {
      result[da] = data[da];
    }
  } 
  return result;
};

// Actions
//* Ask mentor about organizing this code *

app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key] = { longURL: req.body.longURL, userID: req.cookies["userID"] }
  res.redirect(`/urls/${key}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const key = req.params.shortURL;
  if (keyCheck('userID', req.cookies['userID'], urlDatabase )) {
    delete urlDatabase[key];
    res.redirect("/urls");
  } else {
    res.redirect("/login")
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const key = req.params.shortURL;
  if (keyCheck('userID', req.cookies['userID'], urlDatabase )) {
    urlDatabase[key].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL/change", (req, res) => {
  const key = req.params.shortURL;
  res.redirect(`/urls/${key}`);
});

app.post("/login", (req, res) => {
  console.log('userDatabase :', userDatabase);

  if (!keyCheck('email', req.body.email, userDatabase)) {
    res.status(403).json({ message: '403, email not found'})
  } else if (keyCheck('email', req.body.email, userDatabase) && !bcrypt.compareSync(req.body.password, findKeyFromEmail(req.body.email, 'password', userDatabase))) {
    res.status(403).json({ message: '403, password does not match email'})
  } else if (keyCheck('email', req.body.email, userDatabase) && bcrypt.compareSync(req.body.password, findKeyFromEmail(req.body.email, 'password', userDatabase))) {
    res.cookie('userID', findKeyFromEmail(req.body.email, 'id', userDatabase));
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
      password: bcrypt.hashSync(req.body.password, 10)
    };
    res.cookie('userID', userID);
    res.redirect('/urls');
  } else {
    res.status(400).json({ message: '400, email already exists'});
  }
});

// Routes

app.get('/urls', (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']], urls: urlsForUser(req.cookies['userID'], urlDatabase) };
  if (templateVars.user) {
    res.render('urls_index', templateVars);
  } else {
    res.render('user_login', templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: userDatabase[req.cookies['userID']], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
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




