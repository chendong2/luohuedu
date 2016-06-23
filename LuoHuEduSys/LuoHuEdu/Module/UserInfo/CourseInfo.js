

//获取JSON数据并填充到相应表单
getTheYear();
ajaxCRUD({
    url: '/WebServices/Admin/Student.asmx/GetAllStudent',
    success: function (data) {
        fillData();
    }
});


//获取年份数据
function getTheYear() {
    var currentYear = new Date().getFullYear();
    $("#sTheYear").empty();
    for (var i = 1; i <= 15; i++) {
        var data = currentYear - i + "-" + (currentYear - i + 1);
        var option = "<option value='" + data + "'>" + data + "</option>";
        $("#sTheYear").append(option);
    }
}

function fillData() {
}
