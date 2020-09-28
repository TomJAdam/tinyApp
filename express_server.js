// express server

const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xvn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

// app.get('/hello', (req, res) => {
//   res.send('<html><body>HELLO <b>WORLD</b></body></html>\n');
// });

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render('hello_world', templateVars);
});