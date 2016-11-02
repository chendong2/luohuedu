/***********************************
/* 创建人：jjx
/* 修改日期：2014-01-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '学员信息管理',
        columns: [[
            { field: 'Id', checkbox: true },
            { field: 'Manage', title: '操作', width: 80,
                formatter: function (value, rec) {
                    var btn = '<a class="editcls" onclick="TongBuCourse(\'' + rec.IDNo + '\')" href="javascript:void(0)">重新同步学时</a>';
                    return btn;
                }
            },
            { field: 'Name', title: '姓名', width: 80, sortable: false },
            { field: 'LoginId', title: 'LoginId', width: 80, sortable: false },
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
            { field: 'BirthdayStr', title: '生日', width: 100, sortable: false },
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
             { field: 'State', title: '状态', width: 60, sortable: false,
                 formatter: function (value) {
                     if (value == "1") {
                         return '<span style="color:green">在职</span>';
                     } else {
                         return '<span  style="color:red">离退休</span>';
                     }
                 }
             },
             { field: 'Telephone', title: '手机', width: 100, sortable: false },
            { field: 'RegistrationCode', title: '市注册码', width: 100, sortable: false }
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
        onDblClickRow: function (rowIndex, rowData) {
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
            href: '/View/Admin/Student/StudentForm.htm',
            onLoad: function () {
            }
        });
        panel('tongbuTemplate', {
            href: '/View/Admin/Student/TongBuCourse.htm',
            onLoad: function () {
            }
        });
    }
}

var moduleName = '学员信息管理-';

//点击“新增”按钮
function addData() {
    openDialog('dlg', {
        title: moduleName + '新增',
        iconCls: 'icon-add'
    });
    getAllSchool();
    getAllSubject();
    resetFormAndClearValidate('ff');
}

//点击“编辑”按钮
function editData() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '编辑', '请选择要编辑的一行数据', '');
    } else {
        resetFormAndClearValidate('ff');
        fillForm(row.Id);
    }
}

//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    getAllSubject();
    getAllSchool();
    ajaxCRUD({
        url: '/WebServices/Admin/Student.asmx/GetAllStudentById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '编辑',
                iconCls: 'icon-edit'
            });
            $("#HidName").val(data.SubjetName);
            //JSON数据填充表单
            loadDataToForm('ff', data);
            //            var bir = $("#txtBirthday").val();
            //            bir.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
            //            $("#txtBirthday").val(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
        }
    });
}

//获取全部的免修数据
function getAllSchool() {
    $("#sSchool").empty();
    var option = "<option value=''>请选择</option>";
    $("#sSchool").append(option);
    ajaxCRUD({
        url: '/WebServices/Parameter/School.asmx/GetAllSchool',
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i].toString().split('******');
                option = "<option value='" + value[1] + "'>" + value[0] + "</option>";
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

//保存表单数据
function saveData() {
    if (!formValidate('ff')) {
        return;
    }

    var hidValue = $("#HidId").val();
    var basicUrl = '/WebServices/Admin/Student.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateStudent"; //修改
    } else {
        wsMethod = "AddStudent"; //新增
    }

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{studentBo:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            var msg = '';
            if (hidValue.length > 0) {
                msg = "修改成功"; //修改
            } else {
                msg = "新增成功,用户初始密码为六个零000000"; //新增
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
        url: '/WebServices/Admin/Student.asmx/DeleteStudentsByIds',
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

//点击“审核”按钮
function TongBuCourse(idNo) {
    openDialog('TongBuDlg', {
        title: moduleName + '同步学时',
        iconCls: 'icon-add'
    });
    
}

//保存“课程审核”表单数据
function saveLockedAuditSetData() {
    var row = getSelectedRow('dg');
    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/SingleTongBuOldData',
        data: "{IDNo:'" + row.IDNo + "'}",
        success: function (data) {

            if (data == true) {
               msgShow('提示', '同步成功', 'info');
           } else {
               msgShow('提示', '同步失败', 'info');
           }
        }
    });

} //saveCourseAuditSetData

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
