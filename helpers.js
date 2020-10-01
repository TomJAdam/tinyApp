// ** HELPER FUNCTIONS ** 

// Creates 6 char Encoded String
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

// Returns key value from email (user email, 'string', object)
const findKeyFromEmail = (email, key, data) => {
  for (let da in data) {
    if (data[da].email === email) {
      return data[da][key];
    }
  }
};

// loads user specific urls (cookies/userID, urldatabase)
const urlsForUser = (id, data) => {
  let result = {}
  for (let da in data) {
    if (data[da].userID === id) {
      result[da] = data[da];
    }
  } 
  return result;
};

module.exports = { generateRandomString, keyCheck, findKeyFromEmail, urlsForUser };