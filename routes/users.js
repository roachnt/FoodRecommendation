var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rooter',
  database: 'FoodRecommendation',
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Food Recommendaton App' });
});

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  var username = req.params.username;
  var query = `SELECT * FROM user WHERE username='${username}'`;
  conn.query(query, function (err, result) {
      // If nothing is found, send 404
      if (result.length == 0) {
          res.status(404).send('User does not exist!');
      }
      // If the user is found, render their profile
      else {
          var user = result[0];
          res.render('profile', { user: user, title: 'Food Recommendation' });
      }
  });
});

router.get('/:username/nutrition', function(req, res, next) {
  var username = req.params.username;
  var query = `SELECT * FROM user WHERE username='${username}'`;
  conn.query(query, function (err, result) {
      // If nothing is found, send 404
      if (result.length == 0) {
          res.status(404).send('User does not exist!');
      }
      // If the user is found, render their profile
      else if (!sess || sess.username != username) {
          res.render('index', {title: 'Food Recommendation' });
      }
      else {
        var user = result[0];
        res.render('nutritionform', { user: user, title: 'Food Recommendation' });
    }
  });
});

router.post('/:username/updatenutrition', function(req, res, next) {
  var protein = req.body.protein;
  var carbs = req.body.carbs;
  var fat = req.body.fat;
  var calories = 4*protein + 4*carbs + 9*fat;

  var query = `UPDATE user SET calories=${calories}, protein=${protein}, carbs=${carbs}, fat=${fat} WHERE username='${req.params.username}';`;
  conn.query(query, function (err, result) {
    // If error reload login page
    if (err) {
      console.log('Could not update!');
      console.log(err);
    }
    else {
      res.redirect(`/users/${req.params.username}`);
    }
  });
});

module.exports = router;
