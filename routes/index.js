var express = require('express');
var router = express.Router();
var debug = require('debug')('signin:index');
/* GET home page. */

module.exports = function(db) {
  debug("index begin");

  var userManager = require('../models/user')(db);

  debug('get userManager');

  router.post('/regist', function(req, res, next) {
    var user = req.body;
    userManager.checkUser(user)
      .then(userManager.createUser)
      .then(function(){
        req.session.user = user;
        req.session.title = '注册成功';
        res.redirect('/detail');
      })
      .catch(function(err){
        debug(err);
        res.redirect('/regist');
      });
  });

  router.get('/signout', function(req, res, next) {
    delete req.session.user;
    res.redirect('/signin');
  });

  // operation require login in
  router.all('/detail', function(req, res, next) {
    req.session.user ? next() : res.redirect('/signin');
  });

  router.all('/', function(req, res, next) {
    req.session.user ? res.redirect('/detail') : res.redirect('/signin');
  });

  // 仍然待修改接口 12.26
  router.post('/checkRepeat', function(req, res, next) {
    var user= req.body;
    userManager.checkUser(user)
      .then(function() {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('legal');
      })
      .catch(function(err){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(err);
      });
  });

  router.post('/signin', function(req, res, next) {
    userManager.findUser(req.body.username, req.body.password)
      .then(function(user) {
        req.session.title = '详情';
        req.session.user = user;
        res.redirect('/detail');
      })
      .catch(function(err) {
        console.log(req.body.username);
        res.render('signin', {user: {username: req.body.username, password: req.body.password}, error: '用户名或密码错误'});
      });
  });

  router.get('/regist', function(req, res, next) {
    res.render('regist');
  });

  router.get('/signin', function(req, res, next) {
    res.render('signin');
  });

  router.get('/detail', function(req,res, next) {
    var urlTail = req.url.split('/detail?username=')[1];
    if (urlTail != req.session.user.username && urlTail) {
      res.render('detail', {title: '只能够访问自己的数据', user: req.session.user});
    } else {
      res.render('detail', {title: req.session.title, user: req.session.user});
    }
  });
  return router;
}