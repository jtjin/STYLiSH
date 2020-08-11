const express = require('express');

const router = express.Router();

// get node-fetch
const fetch = require('node-fetch');

// Connecting to MySQL server
const mysql = require('../modules/mysql_connect');

// Parses requests with JSON
router.use(express.json());
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

// Get crypto
const crypto = require('crypto');

// Create hash
function createHash(content) {
  return crypto.createHash('sha256')
    .update(content)
    .digest('hex');
}

// For Sign Up
router.post('/user/signup', async (req, res, next) => {
  try {
    let result;
    let addUser;
    let access_token;
    const access_expired = 3600;
    switch (req.body.provider) {
      case 'native':
        // check if the email exist
        const userInput = [req.body.provider, req.body.email];
        result = await mysql.query('SELECT * FROM user WHERE provider=? and email = ?', userInput);
        if (result.length !== 0) {
          res.status(403).send({ error: 'Sorry, this email address is already registered...' });
          return;
        }
        // If email not exist, add it into database
        access_token = createHash(req.body.password);
        const password = createHash(req.body.email + req.body.password);
        addUser = {
          id: Math.round(Math.random() * 100000),
          provider: req.body.provider,
          name: req.body.name,
          email: req.body.email,
          picture: 'https://d2hv8i2cf75388.cloudfront.net/doge-wallpaper-3.jpeg',
          access_token,
          password,
          access_expired,
        };
        await mysql.query('INSERT INTO user SET ?', addUser);
        break;
      case 'facebook':
        // check if the email exist
        result = await mysql.query('SELECT * FROM user WHERE id = ?', req.body.id);
        if (result.length !== 0) {
          res.status(403).send({ error: 'Sorry, this email address is already registered...' });
          return;
        }
        // If email not exist, get the profile and add it into database
        await fetch(`https://graph.facebook.com/me/?access_token=${req.body.access_token}&fields=id,name,email,picture`)
          .then((res) => res.json())
          .then(async (data) => {
            access_token = createHash(data.id + req.body.provider);
            addUser = {
              id: req.body.id,
              provider: req.body.provider,
              name: data.name,
              email: data.email,
              picture: data.picture.data.url,
              access_token,
              access_expired,
            };
            await mysql.query('INSERT INTO user SET ?', addUser);
          });
        break;
      default:
        res.status(403).send({ error: 'Wrong Request' });
        return;
    }
    const user = {
      data: {
        access_token,
        access_expired,
        user: {
          id: addUser.id,
          provider: addUser.provider,
          name: addUser.name,
          email: addUser.email,
          picture: addUser.picture,
        },
      },
    };
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// For Log In
router.post('/user/login', async (req, res, next) => {
  try {
    let result;
    let access_token;
    const login_time = Date.now();
    const access_expired = 3600;
    switch (req.body.provider) {
      case 'native':
        const userInput = [req.body.provider, req.body.email];
        // check if the email exist
        result = await mysql.query('SELECT * FROM user WHERE provider=? and email = ?', userInput);
        if (result.length == 0) {
          res.status(400).send({ error: 'Sorry, this email didn\'t exist, please sign up' });
          return;
        }
        // If email exist, check password
        const password = createHash(req.body.email + req.body.password);
        if (password !== result[0].password) {
          res.status(403).send({ error: 'Sorry, wrong password...' });
          return;
        }
        // Login successfully, update access_token & access_expired & login_time
        access_token = createHash(req.body.email + req.body.password + login_time);
        await mysql.query('UPDATE user SET access_token = ?, access_expired = ?, login_time = ? WHERE email = ?', [access_token, access_expired, login_time, req.body.email]);
        break;
      case 'facebook':
        // check if the email exist
        result = await mysql.query('SELECT * FROM user WHERE id = ?', req.body.id);
        if (result.length == 0) {
          res.status(400).send({ error: 'Sorry, this email didn\'t exist, please sign up' });
          return;
        }
        // Login successfully, update access_token & access_expired & login_time
        access_token = createHash(req.body.id + req.body.provider + login_time);
        await mysql.query('UPDATE user SET access_token = ?, access_expired = ?, login_time = ? WHERE id = ? ', [access_token, access_expired, login_time, req.body.id]);
        break;
      default:
        res.status(403).send({ error: 'Wrong Request' });
        return;
    }
    const user = {
      data: {
        access_token,
        access_expired,
        user: {
          id: result[0].id,
          provider: result[0].provider,
          name: result[0].name,
          email: result[0].email,
          picture: result[0].picture,
        },
      },
    };
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// For User Profile
router.get('/user/profile', async (req, res, next) => {
  try {
    // No authorization
    if (!req.headers.authorization) {
      res.status(400).send({ error: 'Wrong Request: authorization is required.' });
      return;
    }
    const access_token = req.headers.authorization.substr(7);
    const result = await mysql.query('SELECT * FROM user WHERE access_token = ?', access_token);
    if (result.length == 0) {
      res.status(403).send({ error: 'Invalid Access Token' });
      return;
    }
    // Correct access_token
    const profile = {
      data: {
        id: result[0].id,
        provider: result[0].provider,
        name: result[0].name,
        email: result[0].email,
        picture: result[0].picture,
        login_time: result[0].login_time,
      },
    };
    res.send(profile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
