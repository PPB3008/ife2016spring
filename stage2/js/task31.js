(function() {
    var student       = document.querySelector("#student"),
        employee      = document.querySelector("#employee"),
        student_info  = document.querySelector(".student_info"),
        employee_info = document.querySelector(".employee_info"),
        selects       = student_info.querySelectorAll("select");

    addHandler(student, "change", function() {
        employee_info.style.display = "none";
        student_info.style.display = "block";
    });
    addHandler(employee, "change", function() {
        student_info.style.display = "none";
        employee_info.style.display = "block";
    });
    addHandler(selects[0], "change", function() {
        for(var iter = 1, len = selects.length; iter < len; iter++) {
            selects[iter].style.display = "none";
        }
        selects[this.selectedIndex+1].style.display = "inline-block";
    });
})();
