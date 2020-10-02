//   *** TinyApp Server ***

const cookieSession = require('cookie-session');
const express = require('express');
const bcrypt = require('bcrypt');

// Functions
const { generateRandomString, keyCheck, findKeyFromEmail, urlsForUser } = require('./helpers');

// Server Setup
const app = express();
const PORT = 8080;

// Middleware
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');

// Enables Local Host
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Databases
const urlDatabase = {
  //EXAMPLE: '02x322': { longURL: 'http://www.lighthouselabs.ca', userID: 'b2xvn2' },
};

const userDatabase = {
  // EXAMPLE:
  // "userRandomID": {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur"
  // },
};

// Actions
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${key}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id], urls: urlsForUser(req.session.user_id, urlDatabase) };
  const key = req.params.shortURL;
  if (keyCheck('userID', req.session.user_id, urlDatabase)) {
    delete urlDatabase[key];
    res.redirect("/urls");
  } else {
    templateVars.error = 'Not your URL!';
    res.render('error', templateVars);
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id], urls: urlsForUser(req.session.user_id, urlDatabase) };
  const key = req.params.shortURL;
  if (keyCheck('userID', req.session.user_id, urlDatabase)) {
    urlDatabase[key].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    templateVars.error = 'Not your URL!';
    res.render('error', templateVars);
  }
});

app.post("/urls/:shortURL/change", (req, res) => {
  const key = req.params.shortURL;
  res.redirect(`/urls/${key}`);
});

app.post("/login", (req, res) => {

  if (!keyCheck('email', req.body.email, userDatabase)) {
    res.render('user_login', { user: null , error: 'Email not found' });
  } else if (keyCheck('email', req.body.email, userDatabase) && !bcrypt.compareSync(req.body.password, findKeyFromEmail(req.body.email, 'password', userDatabase))) {
    res.render('user_login', { user: null , error: 'Incorrect password' });
  } else if (keyCheck('email', req.body.email, userDatabase) && bcrypt.compareSync(req.body.password, findKeyFromEmail(req.body.email, 'password', userDatabase))) {
    req.session.user_id = findKeyFromEmail(req.body.email, 'id', userDatabase);
    res.redirect(`/urls`);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.post("/register", (req, res) => {
  let userID = generateRandomString();

  if (!keyCheck('email', req.body.email, userDatabase)) {
    userDatabase[userID] = {
      id: userID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id = userID;
    res.redirect('/urls');
  } else {
    res.render('user_registration', { user: null , error: 'Email already exists' });
  }
});

// Routes
app.get('/', (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id], urls: urlsForUser(req.session.user_id, urlDatabase) };
  if (templateVars.user) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get('/urls', (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id], urls: urlsForUser(req.session.user_id, urlDatabase) };
  if (templateVars.user) {
    res.render('urls_index', templateVars);
  } else {
    templateVars.error = 'Please login!';
    res.render('error', templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id] };
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id], shortURL: req.params.shortURL};
  if (urlsForUser(req.session.user_id, urlDatabase)[templateVars.shortURL] === undefined) {
    templateVars.error = 'This URL is invalid or does not belong to you!';
    res.render('error', templateVars);
  } else if (templateVars.user.id === urlsForUser(req.session.user_id, urlDatabase)[templateVars.shortURL]['userID']) {
    templateVars.longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.render("urls_show", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get("/u/:shortURL", (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id] };
  if (urlDatabase[req.params.shortURL] !== undefined) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    templateVars.error = 'This URL does not exist!';
    res.render('error', templateVars);
  }
});

app.get("/register", (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id], error: '' };
  if (templateVars.user) {
    res.redirect('/urls');
  } else {
    res.render("user_registration", templateVars);
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: userDatabase[req.session.user_id], error: '' };
  if (templateVars.user) {
    res.redirect('/urls');
  } else {
    res.render('user_login', templateVars);
  }
});




