var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const fatAPI = new (require('fatsecret'))('2daa4fc48c494e61b82e1d567f0df576', '1a9420e477594bff82475096785f26fa');

// Connect to database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rooter',
    database: 'FoodRecommendation',
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('food');
});

router.post('/search', function (req, res, next) {
    var food = req.body.food.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    fatAPI
        .method('foods.search', {
            search_expression: food,
            max_results: 20
        })
        .then(function (results) {
            var descriptions = [];
            var foods = results.foods.food;
            console.log(foods);
            foods.forEach(food => {
                var description = food.food_description.split('|');
                description[0] = description[0].split('-')[1];
                for (var i = 0; i < description.length; i++) {
                    description[i] = parseFloat(description[i].replace(/[^\d.-]/g, ''));
                }
                descriptions.push(description);
            });
            res.render('search', { results: results.foods.food, descriptions: descriptions });
        })
        .catch(err => console.error(err));


});

router.post('/add', function (req, res, next) {
    if (!sess) {
        res.redirect('/register');
        return;
    }
    var food_name = req.body.food_name.replace("'", "''");
    var brand_name = req.body.brand_name.replace("'", "''");
    var calories = parseInt(req.body.calories);
    var protein = parseFloat(req.body.protein);
    var carbs = parseFloat(req.body.carbs);
    var fat = parseFloat(req.body.fat);

    var query = `INSERT INTO food_logs (food_name, brand, calories, protein, carbs, fat, username, log_date) VALUES ('${food_name}',
        '${brand_name}', ${calories}, ${protein}, ${carbs},
        ${fat}, '${sess.username}', CURDATE());`;
    console.log(food_name);
    console.log(brand_name);
    console.log(calories);
    console.log(protein);
    console.log(carbs);
    console.log(fat);
        
    conn.query(query, function (err, result) {
        if (err) {
            console.log('Could not login user!');
            console.log(err);
            res.render('login', { failedLogin: false });

        }
        else {
            console.log('Success!');
            res.redirect(`/users/${sess.username}`);
        }
    });
    
});

module.exports = router;