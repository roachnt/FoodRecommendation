var express = require('express');
var router = express.Router();
var mysql = require('mysql');
//var session = require('express-session');

// Connect to database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rooter',
    database: 'FoodRecommendation',
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('register');
});

/* POST register new user */
router.post('/createuser', function (req, res, next) {
    // Attempt insertion into user table
    var query = `INSERT INTO user (username, email, password) VALUES ('${req.body.username}','${req.body.email}',MD5('${req.body.password}') )`;
    conn.query(query, function (err, result) {
        if (err) {
            console.log('Could not create user!');
            console.log(err);
            res.render('register');
        }
        else {
            // Create session
            sess = req.session;
            sess.email = req.body.email; 
            sess.username = req.body.username;
            res.redirect('/');
        }
    });
});

module.exports = router;