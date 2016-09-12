/***********************************
/* 创建人：jjx
/* 修改日期：2014-01-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '权限管理',
        columns: [[
            { field: 'Id', checkbox: true },
            { field: 'Name', title: '姓名', width: 80, sortable: false },
            { field: 'IDNo', title: '身份证', width: 180, sortable: false },
            { field: 'SchoolName', title: '学校名称', width: 80, sortable: false },
            { field: 'Sex', title: '性别', width: 60, sortable: false,
                formatter: function (value) {
                    if (value == "1") {
                        return "男";
                    } else {
                        return "女";
                    }
                }
            },
            { field: 'Profession', title: '专业', width: 80, sortable: false },
            { field: 'Professiontitles', title: '职称', width: 80, sortable: false },
            { field: 'Birthday', title: '生日', width: 100, sortable: false,
                formatter: function (value) {
                    value.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
                    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                }
            },
            { field: 'HighDegree', title: '最高学历', width: 80, sortable: false,
                formatter: function (value) {
                    if (value == "1") {
                        return "高中";
                    } else if (value == "2") {
                        return "中专";
                    } else if (value == "3") {
                        return "大专";
                    } else if (value == "4") {
                        return "本科";
                    } else if (value == "5") {
                        return "硕士";
                    } else if (value == "6") {
                        return "博士";
                    } else {
                        return "";
                    }
                }
            },
            { field: 'StudyPeriod', title: '任课学段', width: 80, sortable: false,
                formatter: function (value) {
                    if (value == "1") {
                        return "幼儿";
                    } else if (value == "2") {
                        return "小学";
                    } else if (value == "3") {
                        return "初中";
                    } else if (value == "4") {
                        return "高中";
                    } else {
                        return "其他";
                    }
                }
            },
            { field: 'Office', title: '职务', width: 80, sortable: false },
             { field: 'Telephone', title: '手机', width: 100, sortable: false },
            { field: 'permissions', title: '权限管理', width: 100, sortable: false,
                formatter: function (value) {
                    return "<a style='color:red;cursor:pointer'>修改权限</a>";
                }
            }
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'Name',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var studentData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                studentBo: {}
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Admin/Student.asmx/GetStudentList',
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
            href: '/View/Admin/UserPermissions/PermissionsForm.htm',
            onLoad: function () {
                //                setValidatebox('Name', {
                //                    validType: "unique['WebServices/AdminWebService/JobWebService/JobWebService.asmx/CheckUniqueByJobName','JobName','JobName','jobName','岗位名称']"
                //                });
            }
        });
    }
}

var moduleName = '权限管理-';


//点击“编辑”按钮
function editData() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '权限修改', '请选择要修改权限的一行数据', '');
    } else {
        resetFormAndClearValidate('ff');
        fillForm(row.Id);
    }
}

//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    ajaxCRUD({
        url: '/WebServices/Admin/Student.asmx/GetAllStudentById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '权限修改',
                iconCls: 'icon-edit'
            });
            //JSON数据填充表单
            loadDataToForm('ff', data);
            $("#txtUserName").val($("#txtUserName").val() + "(" + $("#HidName").val() + ")");
            fillPermission();
            $("#perTable tr").each(function () {
                var tag = true;
                $(this).find(":checkbox[name='a']").each(function () {
                    if ($(this).attr("checked") != "checked") {
                        tag = false;
                        return;
                    }
                });
                if (tag) {
                     $(this).find(":checkbox[name='b']").attr("checked", "checked");
                } else {
                     $(this).find(":checkbox[name='b']").attr("checked", false);
                }
            });
        }
    });
}

function check(e) {
    if ($(e).attr("checked") == "checked") {
        $(e).parent().next().find(":checkbox[name='a']").attr("checked","checked");
    } else {
        $(e).parent().next().find(":checkbox[name='a']").attr("checked", false);
    }
}

function checkparent(e) {
    var tag = true;
    $(e).parent().find(":checkbox[name='a']").each(function () {
        if ($(this).attr("checked") != "checked") {
            tag = false;
            return;
        }
    });
    if(tag) {
        $(e).parent().prev().find(":checkbox[name='b']").attr("checked","checked");
    }else {
        $(e).parent().prev().find(":checkbox[name='b']").attr("checked",false);
    }
}

function fillPermission() {
    $("#perTr").nextAll().remove();
    var modulename = "";
    var hmtl = "";
    var perStr = "";
    ajaxCRUD({
        url: '/WebServices/Admin/UserPermissions.asmx/getUserPermissionsList',
        data: "{userId:'" + $("#HidId").val() + "'}",
        async: false,
        success: function (data) {
            perStr = data;
        }
    });
    ajaxCRUD({
        url: '/WebServices/Admin/UserPermissions.asmx/getAllPermissionsList',
        async: false,
        success: function (data) {
            hmtl = hmtl + "<tr><td style='width: 20%;' class='td_right'><input style='margin-left:33px;float:left;' name='b' type='checkbox' onchange='check(this);'/>管理员级别:</td><td class='td_left' colspan='3'  >"
                + " <input style='margin-left:8px;margin-top:5px;float:left;'  onchange='checkparent(this);' name='a' type='checkbox' ";
            if (perStr.indexOf(data[0].PermissionsName) > -1) {
                hmtl = hmtl + " checked='checked' ";
            }
            hmtl = hmtl + " value='" + data[0].Id + "'/><div style='margin-top:5px;float:left;padding-bottom:5px;'>" + data[0].PermissionsName + "</div>"
                + " <input style='margin-left:8px;margin-top:5px;float:left;' onchange='checkparent(this);' name='a' type='checkbox' ";
            if (perStr.indexOf(data[1].PermissionsName) > -1) {
                hmtl = hmtl + " checked='checked' ";
            }
            hmtl = hmtl + " value='" + data[1].Id + "'/><div onchange='checkparent(this);'  style='margin-top:5px;float:left;padding-bottom:5px;'>" + data[1].PermissionsName + "</div></td></tr>";

            for (var a = 2; a < data.length; a++) {
                var value = data[a];
                if (modulename != value.ModuleNAME) {
                    modulename = value.ModuleNAME;
                    if (a > 2) {
                        hmtl = hmtl + "</td></tr>";
                    }
                    hmtl = hmtl + "<tr><td style='width: 20%' class='td_right'><input style='margin-left:45px;float:left;' name='b' type='checkbox' onchange='check(this);' />" + value.ModuleNAME
                        + ":</td><td class='td_left' colspan='3'> <input onchange='checkparent(this);' style='margin-left:8px;margin-top:5px;float:left;' name='a' type='checkbox' ";
                    if (perStr.indexOf(data[a].PermissionsName) > -1) {
                        hmtl = hmtl + " checked='checked' ";
                    }
                    hmtl = hmtl + " value='" + data[a].Id + "'/><div style='margin-top:5px;float:left;padding-bottom:5px;'>" + data[a].PermissionsName + "</div>";
                } else {
                    hmtl = hmtl + "<input onchange='checkparent(this);' style='margin-left:8px;margin-top:5px;float:left;' name='a' type='checkbox' ";
                    if (perStr.indexOf(data[a].PermissionsName) > -1) {
                        hmtl = hmtl + " checked='checked' ";
                    }
                    hmtl = hmtl + " value='" + data[a].Id + "'/><div  style='margin-top:5px;float:left;padding-bottom:5px;'>" + data[a].PermissionsName + "</div>";
                }
            }
        }
    });
    $("#perTable").append(hmtl);
}




//保存表单数据
function saveData() {
    if (!formValidate('ff')) {
        return;
    }
    var perList ="";
    $("input[name='a']:checked").each(function () {
        perList=perList+$(this).val()+",";
    });
    perList = perList.substring(0, perList.length - 1);

    ajaxCRUD({
        url: '/WebServices/Admin/UserPermissions.asmx/AddPermissions',
        data: "{userPermissionsList:'" + perList + "',userId:'" + $("#HidId").val() + "'}",
        success: function (data) {
            var msg = "权限修改成功"; //修改
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



function Search() {
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var studentData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                studentBo: {
                    Name: $.trim($("#txtName").val()),
                    IDNo: $.trim($("#txtIDNo").val()),
                    SchoolName: $.trim($("#txtSchoolName").val())
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Admin/Student.asmx/GetStudentList',
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
