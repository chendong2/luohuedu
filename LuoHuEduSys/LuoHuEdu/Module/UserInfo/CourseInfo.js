

//获取JSON数据并填充到相应表单
getAllSubject();
getAllSchool();
ajaxCRUD({
    url: '/WebServices/Admin/Student.asmx/GetAllStudent',
    success: function (data) {
        //JSON数据填充表单
        loadDataToForm('ff', data);
        var bir = $("#txtBirthday").val();
        bir.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
        $("#txtBirthday").val(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
    }
});

//获取全部的免修数据
function getAllSchool() {
    $("#sSchool").empty();
    ajaxCRUD({
        url: '/WebServices/Parameter/School.asmx/GetAllSchool',
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i].toString().split('******');
                var option = "<option value='" + value[1] + "'>" + value[0] + "</option>";
                $("#sSchool").append(option);
            }
        }
    });
}

function getAllSubject() {
    $("#sFirstTeaching").empty();
    $("#sSecondTeaching").empty();
    var option = "<option value=''>未设定</option>";
    $("#sFirstTeaching").append(option);
    $("#sSecondTeaching").append(option);
    ajaxCRUD({
        url: '/WebServices/Parameter/Subject.asmx/GetAllSubject',
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i].toString().split('******');
                option = "<option value='" + value[1] + "'>" + value[0] + "</option>";
                $("#sFirstTeaching").append(option);
                $("#sSecondTeaching").append(option);
            }
        }
    });
}

function reset() {
    resetFormAndClearValidate("ff");
}
//end saveDataChangeUserPsw()
//重置表单并同时清除验证
function resetFormAndClearValidate(formId) {
    clearForm(formId);
    resetForm(formId);
    clearValidate(formId);
}
