var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wild Chicken University' });
});

router.get('/catalog', function(req, res, next) {
  res.render('catalog', { title: 'WCU Class Catalog' });
});

module.exports = router;
