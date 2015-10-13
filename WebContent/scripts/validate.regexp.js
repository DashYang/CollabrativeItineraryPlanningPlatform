jQuery.validator.addMethod("userName", function (value, element) {
    return digitsorletters(value);
}, "用户名只能包括英文字母和数字！");

jQuery.validator.addMethod("password", function (value, element) {
    return this.optional(element) || !(digits(value) || letters(value)) && digitsorletters(value);
}, "请使用字母加数字的组合密码，不能单独使用字母、数字!");

function digits(value) {
    return /^\d*$/.test(value);
}

function letters(value) {
    var reg = /^[a-zA-Z]*$/;
    return reg.test(value);
}

function hasDigitOrLetter(value) {
    return /\d/.test(value) || /[a-zA-Z]/.test(value);
}

function digitsorletters(value) {
    return /^[0-9a-zA-Z]+$/.test(value);
}
