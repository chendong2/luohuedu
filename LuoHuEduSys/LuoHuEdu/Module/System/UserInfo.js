using(easyloader.defaultReferenceModules, function () {
    reset();
});

//修改密码
function saveDataChangeUserPsw() {
    if (!formValidate('ffChangeUserPsw')) {
        return;
    }
    if ($('#txtPassword').val() != '') {
        var basicUrl = '/WebServices/UserInfo/Common.asmx/';
        var wsMethod = '';
        wsMethod = "ChangeUserPsw"; //修改密码
        var formUrl = basicUrl + wsMethod;

        var form2JsonObj = form2Json("ffChangeUserPsw");
        var form2JsonStr = JSON.stringify(form2JsonObj);
        var jsonDataStr = "{studentBo:" + form2JsonStr + "}";

        ajaxCRUD({
            url: formUrl,
            data: jsonDataStr,
            success: function (data) {
                if (data == 1) {
                    $.messager.alert('提示', '修改密码成功', 'info', function () {  });
                }
                if (data == 0) { msgShow('提示', '修改密码失败', 'info'); }
                if (data == 2) { msgShow('提示', '原密码不正确', 'info'); }
            }
        });
    }
}
function reset() {
    resetFormAndClearValidate("ffChangeUserPsw");
}
//end saveDataChangeUserPsw()
//重置表单并同时清除验证
function resetFormAndClearValidate(formId) {
    clearForm(formId);
    resetForm(formId);
    clearValidate(formId);
}

function closeParentTab() {
    parent.closeCurrentTab();
}