

//获取JSON数据并填充到相应表单
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

//修改密码
function saveData() {
    if (!formValidate('ff')) {
        return;
    }

    var hidValue = $("#HidId").val();
    var basicUrl = '/WebServices/Admin/Student.asmx/';

    
    var wsMethod = "UpdateStudent"; //修改

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{studentBo:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            var msg = '';
            msg = "修改成功"; //修改  msg = "新增成功,用户初始密码为六个零000000"; //新增
            
            if (data == true) {
                msgShow('提示', msg, 'info');
                closeFormDialog();
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
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
