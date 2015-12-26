var validator = {
  form: {
    username: {
      status: false,
      errorMessage: '6~18位英文字母、数字或下划线，必须以英文字母开头'
    },
    password: {
      status: false,
      errorMessage: '密码为6~12位数字、大小写字母、中划线、下划线'
    },
    studentNumber: {
      status: false,
      errorMessage: '8位数字，不能以0开头'
    },
    tel: {
      status: false,
      errorMessage: '11位数字，不能以0开头'
    },
    email: {
      status: false,
      errorMessage: '请输入合法邮箱'
    }
  },

  isUsernameValid: function (username){
    return this.form.username.status = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(username);
  },

  isPasswordValid: function (password){
    return this.form.password.status = /^[a-zA-Z0-9_\-]{6,12}$/.test(password);
  },

  isStudentNumberValid: function (studentNumber){
    return this.form.studentNumber.status = /^[1-9]\d{7}$/.test(studentNumber);
  },

  isTelValid: function (tel){
    return this.form.tel.status = /^[1-9]\d{10}$/.test(tel);
  },

  isEmailValid: function (email){
    return this.form.email.status = /^[a-zA-Z_0-9\-]+@([a-zA-Z_\-]+\.)+[a-zA-Z]{2,4}$/.test(email);
  },

  isFieldValid: function(fieldname, value){
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function(){
    return this.form.password.status && this.form.username.status && this.form.studentNumber.status && this.form.tel.status && this.form.email.status;
  },

  getErrorMessage: function(fieldname){
    return this.form[fieldname].errorMessage;
  },

  isAttrValueUnique: function(registry, user, attr){
    for (var key in registry) {
      if (registry.hasOwnProperty(key) && registry[key][attr] == user[attr]) return false;
    }
    return true;
  }
}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator
}


