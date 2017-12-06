var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var url = require('url');

// Connect to database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rooter',
  database: 'FoodRecommendation',
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', { failedLogin: false });
});

/* POST send login info and authenticate */
router.post('/authenticate', function (req, res, next) {
  // Find user with username
  var query = `SELECT * FROM user WHERE username='${req.body.username}'`;
  conn.query(query, function (err, result) {
    // If error reload login page
    if (err) {
      console.log('Could not login user!');
      console.log(err);
      res.render('login', { failedLogin: false });
      
    }
    // If no result, reload login page with notification
    else if (result.length == 0) {
      res.render('login', { failedLogin: true });
    }
    // If we find a user with the username
    else {
      var realPassword = result[0].password;
      var enteredPassword = md5(req.body.password);
      // If correct password, login
      if (realPassword == enteredPassword) {
        // Create session
        sess = req.session;
        sess.email = result[0].email; 
        sess.username = req.body.username;
        // Redirect to home
        res.redirect(`/users/${sess.username}`);
      }
      // Otherwise reload login page with notification
      else res.render('login', { failedLogin: true });
    }
  });
});

module.exports = router;