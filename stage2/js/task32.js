(function() {
    var username = new Form({
        label: "名称",
        identity: "username",
        success: "名称输入正确",
        fail: "名称输入错误，请重新输入",
        rules: "4-16位,汉字算两位"
    });
    var password = new Form({
        label: "密码",
        type: "password",
        identity: "password",
        success: "密码输入正确",
        fail: "密码输入错误，请重新输入",
        rules: "4-16位,汉字算两位,尽量不要用弱口令"
    });
    var mail = new Form({
        label: "邮箱",
        identity: "mail",
        success: "邮箱格式正确",
        fail: "邮箱格式错误，请重新输入",
        rules: "请输入您的邮箱"
    });
    var phoneNumber = new Form({
        label: "手机号",
        identity: "phoneNumber",
        fail: "手机号无效，请重新输入",
        rules: "请输入手机号"
    });

    var button = new Button();

    username.createSelf();
    password.createSelf();
    mail.createSelf();
    phoneNumber.createSelf();

    button.init(username.formBar);
})();

function Form(options) {
    this.formBar   = options.formBar || document.querySelector(".formBar");
    this.label     = options.label || "";
    this.rules     = options.rules || "请输入";
    this.success   = options.success || "正确";
    this.fail      = options.fail || "错误";
    this.type      = options.type || "text";
    this.identity  = options.identity || "username";
    this.correct   = correct
    this.incorrect = incorrect;
    this.createSelf = function() {
        var form     = document.createElement("div"),
            label    = document.createElement("label"),
            inputBar = document.createElement("div"),
            input    = document.createElement("input"),
            hint     = document.createElement("p"),
            _self    = this;

        form.className     = "form";
        label.innerHTML    = this.label;
        inputBar.className = "inputBar";
        input.type         = this.type;

        inputBar.appendChild(input);
        inputBar.appendChild(hint);
        form.appendChild(label);
        form.appendChild(inputBar);

        this.formBar.appendChild(form);
        this.form = form;

        addHandler(input, "focus", function() {
            hint.innerHTML = _self.rules;
            hint.style.color = "#C1B9B9";
            input.style.borderColor = "#35C3F8";
        });
        addHandler(input, "blur", function() {
            _self.validator();
        });
    };
    this.validator = function() {
        var form = this.form,
            text = trim(form.querySelector("input").value);

        if(!text) {
            this.incorrect(this.form, "输入不能为空");
            return false;
        }
        switch(this.identity) {
            case "username":
            case "password":
                testLen(text) ? this.correct(this.form, this.success) : this.incorrect(this.form, this.fail);
                break;
            case "mail":
                testMail(text) ? this.correct(this.form, this.success) : this.incorrect(this.form, this.fail);
                break;
            case "phoneNumber":
                testPhoneNumber(text) ? this.correct(this.form, this.success) : this.incorrect(this.form, this.fail);
                break;
            default:
                throw {
                    name: "Error",
                    message: type + " error"
                }
        }
    };
};

function testLen(text) {
    var resultLen = 0, i = 0, len = text.length;
    for( ; i < len; i++) {
        if(text.charCodeAt(i) > 255) {
            resultLen += 2;
        } else {
            resultLen += 1;
        }
    }
    return resultLen >= 4 && resultLen <= 16;
};
function testMail(text) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(text);
};
function testPhoneNumber(text) {
    return /^(13[0-9]|15[5-9]|15[0-3]|18[5-9]|180)[0-9]{8}$/.test(text);
};
function correct(form, hintWords) {
    var hint = form.querySelector("p"),
        input = form.querySelector("input");

    hint.innerHTML = hintWords;
    hint.style.color = "#09F62F";
    input.style.borderColor = "#09F62F";
};
function incorrect(form, hintWords) {
    var hint = form.querySelector("p"),
        input = form.querySelector("input");

    hint.innerHTML = hintWords;
    hint.style.color = "#FA0F0F";
    input.style.borderColor = "#FA0F0F";
};

function Button() {
    this.inner = "提交";
    this.init = function(formBar) {
        var button = document.createElement("button");
        button.innerHTML = this.inner;
        formBar.appendChild(button);
        addHandler(button, "click", function() {
            var inputs = formBar.querySelectorAll("input");
            [].forEach.call(inputs, function(item) {
                item.focus();
                item.blur();
            });
        });
    };
};
