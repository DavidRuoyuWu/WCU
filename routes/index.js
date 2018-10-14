var express = require('express');
var router = express.Router();
const flash = require("connect-flash");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'Wild Chicken University' });
});

router.get('/catalog', function(req, res, next) {
  res.render('catalog', { title: 'WCU Class Catalog' });
});

router.get('/home',  ensureAuthenticated, function(req, res){
	res.render('home',{title: 'Home'});
});
router.get('/help',  ensureAuthenticated, function(req, res){
	res.render('help',{title: 'Help'});
});
router.get('/landing', function(req, res){
	res.render('landing',{title: 'Welcome to wildchickenuniversity'});
});

router.get('/python', function(req, res, next) {
  res.render('python', { title: 'WCU Class - python' });
});

router.get('/linearAlgebra', function(req, res){
	res.render('linearAlgebra',{title: 'WCU Class - linear algebra'});
});

router.get('/microeconomics', function(req, res){
	res.render('microeconomics',{title: 'WCU Class - microeconomics'});
});


router.post('/', function (req, res) {
	let search = req.body.class;
  if (search === 'python') {
    res.redirect('/python');
  } else if (search === 'microeconomics') {
    res.redirect('/microeconomics');
  } else if (search === 'linear algebra') {
    res.redirect('/linearAlgebra');
  } else {
    req.flash('success_msg', 'course not found');
    res.redirect('/catalog');
  }

});

router.post('/catalog', function (req, res) {
	let search = req.body.class;
  if (search === 'python') {
    res.redirect('/python');
  } else if (search === 'microeconomics') {
    res.redirect('/microeconomics');
  } else if (search === 'linear algebra') {
    res.redirect('/linearAlgebra');
  } else {
    req.flash('success_msg', 'course not found');
    res.redirect('/catalog');
  }

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/');
	}
}

module.exports = router;
