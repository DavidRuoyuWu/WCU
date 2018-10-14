const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const expressValidator = require('express-validator');
const flash = require("connect-flash");
const session = require("express-session");
const async = require('async');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../models/user');

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:'Login'});
});


router.get('/help', function(req, res, next) {
  res.render('help',{title:'Help'});
});

router.get('/forgot', function(req, res, next) {
  res.render('forgot',{title:'Find My Password'});
});

router.get('/buy-for-others', function(req, res, next) {
  res.render('buyOthers',{title:'Buy Tickets for Others'});
});

// Register User
router.post('/register', upload.single('profileImage'), function (req, res, next) {
	let name = req.body.name;
	let email = req.body.email;
  console.log(email);
	let username = req.body.username;
	let password = req.body.password;
	let password2 = req.body.password2;
	let refer = req.body.refer;
	if (req.file) {
    console.log('Uploading File...')
    var profileImage= req.file.filename;//use var to force the variable leak out to be accessed outsconst
  } else {
    console.log('No File Uploaded');
    var profileImage='yve.jpg';
  }


	// Validation
	req.checkBody('email', 'Please use correct email').isEmail();
	req.checkBody('password2', 'The passwords do not match.').equals(req.body.password);

	let errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: {
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user) {
          req.flash('error_msg','The username is not available')
				}
        if (mail) {
          req.flash('error_msg','You already have an account')
        }
        if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						refer : refer,
      			profileImage : profileImage,
            miles : 0
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You have successfully created a new account');
					res.redirect('/users/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'The account does not exist' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Wrong password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/home');
	});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});


router.post('/forgot', function (req, res, next) {
  let token, address;
  crypto.randomBytes(20, function(err, buf) {
    token = buf.toString('hex');
  });
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
        address= user.email;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save;
      });
      let msg = {
        to: address,
        from: 'no-reply@wildchickenuniversity.com',
        subject: 'WCU find my password',
        text: 'You received this email because you forgot your password\n\n' +
          'Please click the link:\n\n' +
          'https://yve.ink/users/reset/' + token + '\n\n' +
          'If you did not intended to do change the password, please ignore it\n',
      };
      sgMail.send(msg);
      req.flash('success_msg', 'The email is sent to' + address+ 'Please check your mail box');
      res.render('forgot');
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Your link is expired, please get a new one');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

router.post('/reset', function(req, res) {
      let address,name;
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'The link you used is expired or wrong');
          res.render('forgot');
        }
        req.checkBody(req.body.password2, 'The passwords do not match').equals(req.body.password);
        let errors = req.validationErrors();

      	if (errors) {
      		res.render('reset', {
      			errors: errors
      		});
      	}
        address=user.email;
        name=user.name;
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save;
      });
      let confirm_msg = {
        to: address,
        from: 'no-reply@wildchickenuniversity.com',
        subject: 'WCU change password',
        text: 'Dear' + name+ ',\n\n' +
          'You received this message because' + address + 'you have changed your password\n',
      };
      sgMail.send(confirm_msg);
      req.flash('success', 'New password is set, please sign in use your new password');
    res.render('login');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
    req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
