var express = require('express');
var router = express.Router();
const fatAPI = new (require('fatsecret'))('2daa4fc48c494e61b82e1d567f0df576', '1a9420e477594bff82475096785f26fa');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('food');
});

router.post('/search', function(req, res, next) {
    var food = req.body.food;
    fatAPI
    .method('foods.search', {
      search_expression: 'Burger',
      max_results: 20
    })
    .then(function(results) {
        var descriptions = [];
        var foods = results.foods.food;
        foods.forEach(food => {
            var description = food.food_description.split('|');
            description[0] = description[0].split('-')[1];
            descriptions.push(description);
        });
        res.render('search', {results: results.foods.food, descriptions: descriptions});
    })
    .catch(err => console.error(err));

    
});

module.exports = router;