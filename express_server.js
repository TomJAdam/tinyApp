// express server

const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xvn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};


//homepage
app.get('/', (req, res) => {
  res.send('<h1>Hello!</h1>\n<h2>Welcome!</h2>');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


//pages

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


