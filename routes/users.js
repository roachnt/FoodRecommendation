var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rooter',
  database: 'FoodRecommendation',
  multipleStatements: true,
});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Food Recommendaton App' });
});

/* GET users listing. */
router.get('/:username', function (req, res, next) {
  var username = req.params.username;
  var query = `SELECT * FROM user WHERE username='${username}';
                   SELECT * FROM food_logs WHERE username='${username}'`;
  conn.query(query, function (err, result) {
    // If nothing is found, send 404
    if (result.length == 0) {
      res.status(404).send('User does not exist!');
    }
    // If the user is found, render their profile
    else {
      setUser(result[0][0]);
      setLogs(result[1]);
      setNutritionLeft();
      res.render('profile', {user: user, logs: logs, title: 'FoodRec', nutritionLeft: nutritionLeft});
    }
  });
});
function setUser(value) {
  user = value;
}
function setLogs(value) {
  logs = value;
}
function setNutritionLeft() {
  nutritionLeft = [user.calories, user.protein, user.carbs, user.fat];
  logs.forEach(entry => {
    nutritions = [entry.calories, entry.protein, entry.carbs, entry.fat];
    for (var i = 0; i < 4; i++) {
      nutritionLeft[i] -= nutritions[i];
      if (i != 0) nutritionLeft[i] = nutritionLeft[i].toFixed(2);
    }
  });
}

router.get('/:username/nutrition', function (req, res, next) {
  var username = req.params.username;
  var query = `SELECT * FROM user WHERE username='${username}'`;
  conn.query(query, function (err, result) {
    // If nothing is found, send 404
    if (result.length == 0) {
      res.status(404).send('User does not exist!');
    }
    // If the user is found, render their profile
    else if (!sess || sess.username != username) {
      res.render('index', { title: 'Food Recommendation' });
    }
    else {
      var user = result[0];
      res.render('nutritionform', { user: user, title: 'Food Recommendation' });
    }
  });
});

router.post('/:username/updatenutrition', function (req, res, next) {
  var protein = req.body.protein;
  var carbs = req.body.carbs;
  var fat = req.body.fat;
  var calories = 4 * protein + 4 * carbs + 9 * fat;

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

router.post('/:username/deletefood', function (req, res, next) {
  const arr = Object.keys(req.body).map(x => `id='${x}'`)
  const orString = arr.join(' OR ');
  console.log(orString);


  var query = `DELETE FROM food_logs WHERE ${orString}`;
  conn.query(query, function(err, result) {
    if (err) {
      console.log(err);
      res.redirect(`/users/${req.params.username}`);
    }
    else {
      res.redirect(`/users/${req.params.username}`);
    }
  });
});

module.exports = router;
