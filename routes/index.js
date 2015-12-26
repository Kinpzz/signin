var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator.js');
/* GET home page. */
var users = {}

router.post('/signup', function(req, res, next) {
	var user = req.body;
	try {
		checkUser(user);
		req.session.user = user;
		req.session.title = '注册成功';
		users[user.username] = user;
		res.redirect('/detail');
	} catch(err) {
		// only to void illegal attack
		console.log(err);
		res.redirect('/signup');
	}
});

// operation require login in
router.all(/^[\/signup]$/, function(req, res, next) {
	req.session.user ? next() : res.redirect('/signin');
});

router.post('/checkRepeat', function(req, res, next) {
	var user= req.body;
	res.writeHead(200, {'Content-Type': 'text/plain'});
	try {
		checkRepeat(user);
		res.end('legal');
	} catch(err) {
		res.end(err);
	}
});

router.post('/signin', function(req, res, next) {
	var user = req.body;
	if (typeof users[user.username] != 'undefined') {
		if (users[user.username].password === user.password) {
			req.session.title = '详细';
			res.redirect('/detail');
		}
	} else {
		res.render('signin', {user: user, error: '用户名或密码错误'});
	}
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/signin', function(req, res, next) {
	res.render('signin');
});

router.get('/detail', function(req,res, next) {
	res.render('detail', {title: req.session.title, user: req.session.user});
});

module.exports = router;

function checkUser(user) {
  var errorMessages = [];
  for(var key in user) {
  	if (key != 'repeatPassword') {
	    if (!validator.isFieldValid(key, user[key])) errorMessages.push(validator.form[key].errorMessage);
	    if (!validator.isAttrValueUnique(users, user, key)) errorMessages.push(
	      "key: " + key + " is not unique by value: " + user[key]
	    );
	  }
  }
	if (user.password != user.repeatPassword) errorMessage.push('repeatPassword is not equal to password');
  if (errorMessages.length > 0) throw new Error(errorMessages.join(' '));
}
function checkRepeat(user) {
  var errorMessages = [];
  for(var key in user) {
  	if (key != 'password' && key !='repeatPassword') {
	    if (!validator.isAttrValueUnique(users, user, key)) errorMessages.push(
	      key + " is not unique"
	    );
	  }
  }
  if (errorMessages.length > 0) throw errorMessages.join(' ');
}