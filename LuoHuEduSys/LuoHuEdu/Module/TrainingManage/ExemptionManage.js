﻿/***********************************
/* 创建人：jjx
/* 修改日期：2014-01-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '免修审核',
        columns: [[
            { field: 'Id', checkbox: true },
            { field: 'UserName', title: '姓名', width: 80, sortable: false },
            { field: 'ExemptionReason', title: '免修名目', width: 120, sortable: false },
            { field: 'TheYear', title: '年度', width: 120, sortable: false },
            { field: 'CreateOn', title: '申请时间', width: 120, sortable: false,
                formatter: function (value) {
                    value.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
                    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                }
            },
            { field: 'SchoolAudit', title: '中心审批', width: 120, sortable: false,
                formatter: function (value) {
                    if (value == "0") {
                        return "未审核";
                    } else if (value == "1") {
                        return "审核不通过";
                    } else {
                        return "审核通过";
                    }
                }
            },
            { field: 'Audit', title: '审批', width: 80, sortable: false,
                formatter: function (value) {
                    return "<a style='color:red;cursor:pointer'>审批</a>";
                }
            }
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'UserName',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var studentExemptionData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                studentExemptionBo: {}
            };
            var paramStr = JSON.stringify(studentExemptionData);

            ajaxCRUD({
                url: '/WebServices/UserInfo/StudentExemption.asmx/GetStudentExemptionList',
                data: paramStr,
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });

        },
        onClickRow: function (rowIndex, rowData) {
            getTheYear();
            getStudentData();
            getAllExemption();
            fillForm(rowData.Id);
        }
    };

    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);

    //搜索
    searchbox('searchText', {
        searcher: function (value, name) {
            search(value, name);
        },
        menu: '#mm',
        prompt: '输入后直接回车确认'
    });

});

//easyloader.defaultTime为700ms
setTimeout(loadPartialHtml, easyloader.defaultTime);

function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: '/View/TrainingManage/ExemptionManage/ExemptionManageForm.htm',
            onLoad: function () {
                //                setValidatebox('Name', {
                //                    validType: "unique['WebServices/AdminWebService/JobWebService/JobWebService.asmx/CheckUniqueByJobName','JobName','JobName','jobName','岗位名称']"
                //                });
            }
        });
    }
}

var moduleName = '免修登记-';



//获取年份数据
function getTheYear() {
    var currentYear = new Date().getFullYear();
    $("#sTheYear").empty();
    for (var i = 1; i <= 15; i++) {
        var data = currentYear - i + "-" + (currentYear - i + 1);
        var option = "<option  disabled='disabled' value='" + data + "'>" + data + "</option>";
        $("#sTheYear").append(option);
    }
}

//获取全部的免修数据
function getAllExemption() {
    $("#tdExep").empty();
    ajaxCRUD({
        url: '/WebServices/Parameter/Exemption.asmx/GetAllExemption',
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i].toString().split('******');
                var option = "<input disabled='disabled' name='ExemptionId' type='radio'   value='" + value[1] + "' />" + value[0];
                if (i < data.length - 1) {
                    option = option + "<br/>";
                }
                $("#tdExep").append(option);
            }
        }
    });
}

//根据用户Id填充数据
function getStudentData() {
    ajaxCRUD({
        url: '/WebServices/UserInfo/StudentExemption.asmx/getStudentData',
        async: false,
        success: function (data) {
            $("#txtUserNameForm").val(data.UserName);
            if (data.Sex == 1) {
                $("#txtSex").val("男");
            } else {
                $("#txtSex").val("女");
            }
            $("#txtBirthday").val(data.BirthdayStr);
            $("#txtSchoolName").val(data.SchoolName);
        }
    });
}

//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    ajaxCRUD({
        url: '/WebServices/UserInfo/StudentExemption.asmx/GetStudentExemptionById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '审批',
                iconCls: 'icon-edit'
            });
            //JSON数据填充表单
            loadDataToForm('ff', data);
        }
    });
}

//保存表单数据
function saveData() {
    if (!formValidate('ff')) {
        return;
    }

    var hidValue = $("#HidId").val();
    var basicUrl = '/WebServices/UserInfo/StudentExemption.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateStudentExemption"; //修改
    } else {
        wsMethod = "AddStudentExemption"; //新增
    }

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{studentExemptionBo:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            var msg = '';
            if (hidValue.length > 0) {
                msg = "修改成功"; //修改
            } else {
                msg = "新增成功"; //新增
            }
            if (data == true) {
                msgShow('提示', msg, 'info');
                closeFormDialog();
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });
} // end saveData()

//批量删除前台提示
function deleteDatas() {
    deleteItems('dg', deleteDatasAjax);
}

//批量删除后台AJAX处理
function deleteDatasAjax(str) {
    ajaxCRUD({
        url: '/WebServices/UserInfo/StudentExemption.asmx/DeleteStudentExemptionsByIds',
        data: "{ids:'" + str + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '删除成功', 'info');
                refreshTable('dg');
            } else {
                msgShow('提示', '删除失败', 'info');
            }
        }
    });
}

function Search() {
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var studentExemptionData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                studentExemptionBo: {
                    UserName: $("#txtUserName").val().trim()
                }
            };
            var paramStr = JSON.stringify(studentExemptionData);

            ajaxCRUD({
                url: '/WebServices/UserInfo/StudentExemption.asmx/GetStudentExemptionList',
                data: paramStr,
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });
        }
    };

    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);
}


//关闭弹出层
function closeFormDialog() {
    closeDialog('dlg');
}
