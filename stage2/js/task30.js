(function() {
    var formBar   = document.querySelector(".formBar"),
        inputs    = formBar.querySelectorAll("input"),
        submitBtn = formBar.querySelector("button");
    [].forEach.call(inputs, function(item, index, array) {
        addHandler(item, "focus", function() {
            init(this.parentNode.parentNode, index);
        });
        addHandler(item, "blur", function() {
            test(this.parentNode.parentNode, index);
        });
    });
    addHandler(submitBtn, "click", function() {
        var allPass = true;
        [].forEach.call(inputs, function(item, index, array) {
            if(!test(item.parentNode.parentNode, index)) {
                allPass = false;
            }
        });
        alert(allPass ? "提交成功！" : "提交失败！请检查输入后重试！");
    });
})();

function init(form, index) {
    var inputBar = form.querySelector(".inputBar"),
        input    = inputBar.querySelector("input"),
        hint     = inputBar.querySelector(".hint"),
        hintArr  = ["请输入名称", "请输入密码", "再次输入相同的密码", "请输入邮箱", "请输入手机号"];

    hint.innerHTML = hintArr[index];
    hint.style.color = "#C1B9B9";
    input.style.borderColor = "#35C3F8";
}

function test(form, index) {
    var inputBar  = form.querySelector(".inputBar"),
        input     = inputBar.querySelector("input"),
        inputText = trim(input.value),
        hint      = inputBar.querySelector(".hint"),
        testText  = inputText.replace(/[\u4E00-\uFA29]|[\uE7C7-\uE7F3]/g, "aa"),
        result    = false;

    if(!testText) {
        hint.innerHTML = form.querySelector("label").innerHTML+"不能为空";
        hint.style.color = "#FA0F0F";
        input.style.borderColor = "#FA0F0F";
        return false;
    }
    switch(index) {
        case 0:
        case 1:
            testLen() ? correct("格式正确") : incorrect("必须输入4-16个字符");
            break;
        case 2:
            testPassword() ? correct("格式正确") : incorrect("请确保两次输入的密码相同");
            break;
        case 3:
            testMail() ? correct("格式正确") : incorrect("邮箱无效");
            break;
        case 4:
            testPhoneNumber() ? correct("格式正确") : incorrect("手机号无效");
            break;
    }
    return result;
    function testLen() {
        return /^.{4,16}$/.test(testText);
    };
    function testPassword() {
        var inputs = document.querySelectorAll("input");
        return inputs[1].value == inputs[2].value;
    };
    function testMail() {
        return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(inputText);
    };
    function testPhoneNumber() {
        return /^(13[0-9]|15[5-9]|15[0-3]|18[5-9]|180)[0-9]{8}$/.test(inputText);
    };
    function correct(hintWords) {
        hint.innerHTML = hintWords;
        hint.style.color = "#09F62F";
        input.style.borderColor = "#09F62F";
        result = true;
    };
    function incorrect(hintWords) {
        hint.innerHTML = hintWords;
        hint.style.color = "#FA0F0F";
        input.style.borderColor = "#FA0F0F";
    };
};
