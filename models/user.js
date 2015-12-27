var bcrypt = require('bcrypt-as-promised');
var validator = require('../public/javascripts/validator.js');
var debug = require('debug')('signin:user');
var lodash = require('lodash');

module.exports = function(db) {
  debug("user collection begin");
  var users = db.collection('users');
  return  {
    findUser: function(username, password) {
      return users.findOne({username: username}).then(function(user) {
        return user ? bcrypt.compare(password, user.password).then(function() {
          return user;
        }) : Promise.reject('user doesn\'t exist');
      });
    },

    createUser: function(user) {
      var iteration = 10;
      return bcrypt.hash(user.password, iteration).then(function(hash) {
        user.password = hash;
        delete user.repeatPassword;
        return users.insert(user);
      });
    },

    checkUser: function(user) {
      var error = validator.checkUser(user);
      debug(error);
      return new Promise(function(resolve, reject) {
        error.length ? reject(error) : resolve(user);
      }).then(function(){
        return users.findOne(getQueryForUniqueInAttr(user)).then(function(exisitedUser){
          if (exisitedUser) {
            var repeatErr = '';
            debug("existed user", exisitedUser);
            if (exisitedUser.username == user.username) repeatErr += 'username ';
            if (exisitedUser.studentNumber == user.studentNumber) repeatErr += 'studentNumber ';
            if (exisitedUser.tel == user.tel) repeatErr += 'tel ';
            if (exisitedUser.email  == user.email) repeatErr += 'email ';
          }
          return exisitedUser ? Promise.reject( repeatErr + 'not unique') : Promise.resolve(user);
        });
      });
    }

  }
}

function getQueryForUniqueInAttr(user) {
  // {a:1, b:1} -> [{a: 1}, {b: 1}]
  return { 
    '$or': lodash(user).omit('password').omit('repeatPassword').pairs().map(pairToObject).value()
  };
}

function pairToObject(pair) {
  obj = {};
  obj[pair[0]] = pair[1];
  return obj;
}