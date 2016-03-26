(function() {
    var testBtn = document.querySelector(".testBtn");
    addHandler(testBtn, "click", test);
})();

function test() {
    var inputBar = document.querySelector(".inputBar"),
        input = inputBar.querySelector("input"),
        inputText = trim(input.value),
        hint = inputBar.querySelector(".hint"),
        testText = inputText.replace(/[\u4E00-\uFA29]|[\uE7C7-\uE7F3]/g, "aa");

    if(!testText) {
        hint.innerHTML = "姓名不能为空";
        hint.style.color = "#FA0F0F";
        input.style.borderColor = "#FA0F0F";
    } else if (/^.{4,16}$/.test(testText)) {
        hint.innerHTML = "名称格式正确";
        hint.style.color = "#09F62F";
        input.style.borderColor = "#09F62F";
    } else {
        hint.innerHTML = "必须输入4-16个字符,中文字符算两个";
        hint.style.color = "#FA0F0F";
        input.style.borderColor = "#FA0F0F";
    }
};
