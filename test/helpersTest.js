// ** TESTS FOR HELPER FUNCTIONS **

const { assert } = require('chai');

const { findKeyFromEmail, keyCheck, urlsForUser } = require('../helpers.js');

// Test Databases
const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const URLS = {
  '0sf3ks': { longURL: 'http://www.lighthouselabs.ca', userID: 'b2xvn2' },
  's323ds': { longURL: 'http://www.lighthouselabs.ca', userID: 'd238d2' },
  'bewr32': { longURL: 'http://www.lighthouselabs.ca', userID: 'b2xvn2' },
  's3sd3s': { longURL: 'http://www.lighthouselabs.ca', userID: 'd238d2' },
};


// Tests
describe('findKeyFromEmail', function() {
  it('should return they key value of user specified with valid email', function() {
    const user = findKeyFromEmail("user@example.com", 'id', testUsers);
    const expectedOutput = "userRandomID";
    assert(expectedOutput, user);
  });
  it('should return they key value of user specified with valid email', function() {
    const user = findKeyFromEmail("user@example.com", 'password', testUsers);
    const expectedOutput = "purple-monkey-dinosaur";
    assert(expectedOutput, user);
  });
  it('should return undefined with invalid email', function() {
    const user = findKeyFromEmail("bob@example.com", 'password', testUsers);
    const expectedOutput = 'undefined';
    assert(expectedOutput, user);
  });
});

describe('keyCheck', function() {
  it('should return the key value from database with valid key if it exists', function() {
    const user = keyCheck('id', 'user2RandomID', testUsers);
    const expectedOutput = 'user2RandomID';
    assert(expectedOutput, user);
  });
  it('should return the key value from database with valid key if it exists', function() {
    const user = keyCheck('email', 'user2@example.com', testUsers);
    const expectedOutput = 'user2@example.com';
    assert(expectedOutput, user);
  });
  it('should return undefined if value does not exists', function() {
    const user = keyCheck('email', 'bob2@example.com', testUsers);
    const expectedOutput = 'undefined';
    assert(expectedOutput, user);
  });
});

describe('urlsForUser', function() {
  it('should return urls specific to user ID', function() {
    const user = urlsForUser('b2xvn2', URLS);
    const expectedOutput = { '0sf3ks': { longURL: 'http://www.lighthouselabs.ca', userID: 'b2xvn2' }, 'bewr32': { longURL: 'http://www.lighthouselabs.ca', userID: 'b2xvn2' } };
    assert.deepEqual(user, expectedOutput);
  });
  it('should return empty object if user ID not valid', function() {
    const user = urlsForUser('xxxxxx', URLS);
    const expectedOutput = {};
    assert.deepEqual(user, expectedOutput);
  });
});