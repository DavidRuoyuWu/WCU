var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wild Chicken University' });
});

router.get('/catalog', function(req, res, next) {
  res.render('catalog', { title: 'WCU Class Catalog' });
});

router.get('/home',  ensureAuthenticated, function(req, res){
	res.render('home',{title: 'Home'});
});

router.get('/landing', function(req, res){
	res.render('landing',{title: 'Welcome to wildchickenuniversity'});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/');
	}
}

module.exports = router;
