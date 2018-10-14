var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('catalog', { title: 'Wild Chicken University' });
});

router.get('/python', function(req, res, next) {
  res.render('catalog', { title: 'WCU Class - python' });
});

router.get('/linearAlgebra', function(req, res){
	res.render('linearAlgebra',{title: 'WCU Class - linear algebra'});
});

router.get('/microeconomics', function(req, res){
	res.render('microeconomics',{title: 'WCU Class - microeconomics'});
});


module.exports = router;
