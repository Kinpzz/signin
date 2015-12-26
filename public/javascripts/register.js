$(function() {
	$('#reset-info').click(resetInfo);
	$('#submit-info').click(checkInfo);
	$('#login').click(login);
	$('.group-input').focusin(removeError);
	$('#tel-num').focusout(checkTel);
	$('#email').focusout(checkEmail);
	$('#student-number').focusout(checkStuNum);
	$('#user-name').focusout(checkUserName);
	$('#password').focusout(checkPassword);
	$('#repeat-password').focusout(checkRepeatPassword);
});

function resetInfo() {
	var input = $('.group-input').find('input');
	input.each(function(i) {
		$(input[i]).val('');
		removeError.call(input[i]);
	});
	$('.group-input').find('label').remove();
}
function checkInfo() {
	$('.group-input').find('label').remove();
	if (checkUserName() && checkStuNum() && checkEmail() && checkTel() && checkPassword() && checkRepeatPassword()) {
		if (checkUserRepeat()) {
			$('#submit-info').attr('type', 'submit');
		}
	}
}
function login() {
	$('.group-input').find('label').remove();
	if (checkUserName() && checkPassword()) {
		$('#login').attr('type', 'submit');
	}
}

function checkUserRepeat() {
	var repeat = $.ajax({url: '/checkRepeat',
		data: {username: $('#user-name').val(),
			studentNumber: $('#student-number').val(),
			tel: $('#tel-num').val(),
			email: $('#email').val()
		},
		type: "POST",
		async: false
	});
	if (repeat.responseText == 'legal') {
		return true;
	} else {
		if (repeat.responseText.indexOf('username') != -1){
			errorDisplay.call($('#user-name'), '用户名已被注册');
		}
		if (repeat.responseText.indexOf('studentNumber') != -1){
			errorDisplay.call($('#student-number'), '学号已被注册');
		}
		if (repeat.responseText.indexOf('tel') != -1){
			errorDisplay.call($('#tel-num'), '电话已被注册');
		}
		if (repeat.responseText.indexOf('email') != -1){
			errorDisplay.call($('#email'), '邮箱已被注册');
		}
		return false;
	}
}
function checkTel() {
	var tel = $('#tel-num');
	if (!(/^[1-9][0-9]{10}$/.test(tel.val()))) {
		return errorDisplay.call(tel, '请输入正确的手机号');
	}
	return true;
}
function checkEmail() {
	var email = $('#email');
	if (!(/^[a-zA-z_\-0-9]+@(([a-zA-z_\-])+\.)+[a-zA-Z]{2,4}$/.test(email.val()))) {
		return errorDisplay.call(email, '请输入正确的邮箱');
	}
	return true;
}
function checkStuNum() {
	var stuNum = $('#student-number');
	if (!(/^[1-9][0-9]{7}$/.test(stuNum.val()))) {
		return errorDisplay.call(stuNum, '请输入正确的学号');
	}
	return true;
}
function checkPassword() {
	var password = $('#password');
	if (/^[a-zA-Z0-9_\-]{0,}$/.test(password.val())) {
		if (!(/^[a-zA-Z0-9_\-]{6,12}$/.test(password.val()))) {
			return errorDisplay.call(password, '长度应为6-12位');
		}
	} else {
		return errorDisplay.call(password, '非法字符');
	}
	return true;
}
function checkRepeatPassword() {
	var repeatPassword = $('#repeat-password');
	var password = $('#password');
	if (password.val() != repeatPassword.val()) {
		errorDisplay.call(repeatPassword, '两次输入密码不一致');
		return false;
	} else {
		return true;
	}
}
function checkUserName() {
	var userName = $('#user-name');
	if (/^[A-Za-z]+/.test(userName.val())) {
		if (/^[A-Za-z0-9_]+$/.test(userName.val())) {
			if (!(/^[A-Za-z][A-Za-z0-9_]{5,17}$/.test(userName.val()))) {
				return errorDisplay.call(userName, '长度应为6-18位');
			}
		} else {
			return errorDisplay.call(userName, '非法字符');
		}
	} else {
		return errorDisplay.call(userName, '用户名只能以字母开头');
	}
	return true;
}
function errorDisplay(str) {
	var label = $('<label><label>')
	label.html(str);
	label.addClass('error');
	$(this).after(label);
	return false;
}
function removeError() {
	$(event.target).parent().find('label').remove();
}