/***********************************
/* 创建人：jjx
/* 修改日期：2014-01-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
//var referenceModules = $.merge(['jqCookie'], easyloader.defaultReferenceModules);
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        columns: [[
            { field: 'Id', checkbox: true },
             { field: '1', title: '报名', width: 60, formatter: function (value, rec) {
                 if ($.cookie('perList').indexOf("课程报名") > -1) {
                     return '<a style="cursor:pointer" onclick="baoming(\'' + rec.Id + '\')" href="javascript:void(0)">报名</a>';
                 } else {
                     return '';
                 }
             }
         },
           { field: 'Manage', title: '管理', width: 60,
               formatter: function (value, rec) {
                   if (($.cookie('perList').indexOf("学校管理员") > -1))
                   {
                       var btn = '<a class="editcls" onclick="studentManage(\'' + rec.Id + '\')" href="javascript:void(0)">学员管理</a>';
                        return btn;
                   } else {
                              return '';
                          }
                    
                 }
           },
            { field: 'quxiaobaoming', title: '取消报名', width: 60, formatter: function (value, rec) {
                if ($.cookie('perList').indexOf("课程报名") > -1) {
                    return '<a style="cursor:pointer" onclick="deletebaomingData(\'' + rec.Id + '\')" href="javascript:void(0)">取消</a>';
                } else {
                    return '';
                }
            }
            },
            { field: 'CourseName', title: '课程名称', width: 180, formatter: function (value, rec) {
                if ($.cookie('perList').indexOf("课程浏览") > -1) {
                    return '<a style="cursor:pointer" onclick="kecheng(\'' + rec.Id + '\')" href="javascript:void(0)">' + value + '</a>';
                } else {
                    return '';
                }
            }
            },
            { field: 'SchoolName', title: '学校名称', width: 140 },
            { field: 'Name', title: '授课教师', width: 80, sortable: true },
            { field: 'DateTimeStartAndEnd', title: '课程起始', width: 150, sortable: true },
             { field: 'Period', title: '学时', width: 40 },
            { field: 'TrainType', title: '培训类型', width: 80 },
            {field: 'MaxNumber', title: '额定人数', width: 60, sortable: true },
            { field: 'YiBao', title: '已报人数', width: 60, sortable: true },
            { field: 'Locked', title: '锁定', width: 60, sortable: true, formatter: function (value) {
                if (value == 1)
                    return '<span style="red">已锁定</span>';
                else if (value == 2)
                    return '<span>未锁定</span>';
                else
                    return '<span>未设置</span>';
            }
            },
            { field: 'SubjectName', title: '培训科目', width:80 },
       
            {field: 'Address', title: '培训地址', width: 130, sortable: true }

        ]],
        singleSelect: true,
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
                courseBo: {},
                studentId: $.cookie('UserId')
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/AllCourseServices.asmx/GetPerStudents',
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
            href: '/View/Course/TrainingCourseForm.htm',
            onLoad: function () {
            }
        });
        panel('studentManageTemplate', {
            href: '/View/Course/XiaoBenStudentManage.htm',
            onLoad: function () {

            }
        });
        panel('chooseStudentTemplate', {
            href: '/View/Course/XiaoBenChooseStudent.htm',

            onLoad: function () {

            }
        });
    }
}

function kecheng(id) {

    getAllTrainType("ddlTrainType", true);
    getAllSchool("ddlOrganizationalName", true);
    getAllSubject("Subject", true);
    getTheYear();
    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/GetCourseById',
        data: "{id:'" + id + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: '课程信息查看',
                iconCls: 'icon-edit'
            });
            $("#HidName").val(data.SubjetName);
            //JSON数据填充表单
            loadDataToForm('ff', data);
        }
    });
}

//获取所有培训类型数据，用于绑定下拉框
function getAllTrainType(ddlRoute, isSimpleSearch) {
    var webserviceUrl = '/WebServices/Parameter/TrainType.asmx/GetAllTrainTypeNew';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                // 如果是搜索条件用的dll，那么加入请选择选项
                data.unshift({ 'Id': 0, 'TrainType': '请选择' });
            }
            initCombobox(ddlRoute, "Id", "TrainType", data, true);
        }
    });
}


//获取所有培训类型数据，用于绑定下拉框
function getAllSubject(ddlRoute, isSimpleSearch) {
    var webserviceUrl = '/WebServices/Parameter/Subject.asmx/GetAllSubjectNew';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                // 如果是搜索条件用的dll，那么加入请选择选项
                data.unshift({ 'Id': 0, 'SubjectName': '请选择' });
            }
            initCombobox(ddlRoute, "Id", "SubjectName", data, true);
        }
    });
}



//获取年份数据，用于绑定下拉框
function getTheYear() {
    var currentYear = new Date().getFullYear();
    $("#TheYear").empty();
    for (var i = 1; i <= 15; i++) {
        var data = currentYear - i + "-" + (currentYear - i + 1);
        var option = "<option  value='" + data + "'>" + data + "</option>";
        $("#TheYear").append(option);
    }
}


//批量删除前台提示
function baoming(id) {
    $.messager.confirm('课程报名', '确定要报名此课程吗？', function (r) {
        if (r) {
            ajaxCRUD({
                url: '/WebServices/Course/AllCourseServices.asmx/CanBaoMing',
                data: "{courseId:'" + id + "'}",
                success: function (data) {
                    if (data == true) {
                        isbaomingData(id);
                    } else {
                        msgShow('提示', '报名名额已满,您已无法报名！', 'info');
                    }
                }
            });
        }
    });
}

//报名判断
function isbaomingData(str) {
    var row = getSelectedRow('dg');
    ajaxCRUD({
        url: '/WebServices/Course/AllCourseServices.asmx/IsBaoMing',
        data: "{studentId:'" + $.cookie('UserId') + "',cousreId:'" + str + "'}",
        success: function (data) {
            if (data == 2) {
                if (row == null) {
                    msgShow(moduleName + '提示', '请把多选框打勾在进行报名！', '');
                } else {
                    baomingData(str);
                }
            }
            if(data==1) {
                msgShow('提示', '已经报名该课程,不能重复报名！', 'info');
            } 
            if(data==0){
                msgShow('提示', '请补全个人信息中的身份证号！', 'info');
            } 
            if(data==-1){
                msgShow('提示', '未知错误！', 'info');
            }
            
        }
    });
}


//批量删除后台AJAX处理
function deletebaomingData(str) {
    //var row = getSelectedRow('dg');
    ajaxCRUD({
        url: '/WebServices/Course/AllCourseServices.asmx/DeleteCourseStudentNew',
        data: "{studentId:'" + $.cookie('UserId') + "',courseId:'" + str + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '报名已经取消！', 'info');
                refreshTable('dg');
            } else {
                msgShow('提示', '取消报名失败', 'info');
            }
        }
    });
}

//批量删除后台AJAX处理
function baomingData(str) {
    var row = getSelectedRow('dg');
    ajaxCRUD({
        url: '/WebServices/Course/AllCourseServices.asmx/AddCourseStudent',
        data: "{userId:'" + $.cookie('UserId') + "',courseId:'" + str + "'}",
        success: function (data) {
            if (data == true) {
                if (row.TrainType == "集中培训") {
                    msgShow('提示', '报名成功，课程名称：' + row.CourseName + '，该课程启用身份证考勤，请携带身份证！', 'info');
                } else {
                    msgShow('提示', '报名成功！', 'info');
                }
                refreshTable('dg');
            } else {
                msgShow('提示', '报名失败', 'info');
            }
        }
    });
}

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
                courseBo: {
                    CourseName: $("#txtCourseName").val()
                },
                studentId: $.cookie('UserId')
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/AllCourseServices.asmx/GetPerStudents',
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
function closeFormDialog(id) {
    closeDialog(id);
}

var moduleName = '校本培训-';


//点击“学员管理”按钮
function studentManage(courseid) {
    var row = getSelectedRow('dg');
    // 学员管理列表参数设置
    var studentManageDataGridOptions = {

        columns: [[
            { field: 'Id', checkbox: true },
            { field: 'Name', title: '姓名', width: 80, sortable: false },
            { field: 'Sex', title: '性别', width: 60, sortable: false,
                formatter: function (value) {
                    if (value == "1") {
                        return "男";
                    } else {
                        return "女";
                    }
                }
            },
            { field: 'SchoolName', title: '学校名称', width: 80, sortable: false }
        ]],
        singleSelect: false,
        toolbar: '#studentManageToolbar',
        sortName: 'Name',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: false,
        loader: function (param, success, error) {
            var studentData = {
                page: 1,
                rows:600,
                order: '',
                sort: '',
                courseId: courseid
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseStudentByCourseId',
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
            //rowData.Id
        }
    };

    $("#HsmCourseId").val(courseid);

    if (row == null) {
        msgShow(moduleName + '学员管理', '请选择一行数据！', '');
    }
    else if (row.Locked == 1) {
        msgShow(moduleName + '学员管理', '锁定的课程不能编辑学员！', '');
    } else {
        openDialog('studentManageDlg', {
            title: '学员管理',
            iconCls: 'icon-edit',
            onOpen: function () {
                //初始化列表组件
                iniDataGrid('studentManageDG', studentManageDataGridOptions);
            }
        });
    }

}

//学员管理搜索
function StudentSearch() {

    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var studentData = {
                page: 1,
                rows:600,
                order: '',
                sort: '',
                courseId: $("#HsmCourseId").val(),
                studentBo: {
                    Name: $("#txtName").val().trim(),
                    SchoolName: $("#txtSchoolName").val().trim()
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseStudentByCourseId',
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
    iniDataGrid('studentManageDG', dataGridOptions);
}

//批量删除前台提示
function deleteStudentManageDatas() {
    deleteItems('studentManageDG', deleteStudentManageDatasAjax);
}

//批量删除后台AJAX处理
function deleteStudentManageDatasAjax(str) {
    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/DeleteCourseStudent',
        data: "{ids:'" + str + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '删除成功', 'info');
                refreshTable('studentManageDG');
            } else {
                msgShow('提示', '删除失败', 'info');
            }
        }
    });
}

// 选择学员列表参数设置
// 列表参数设置
var chooseStudentDataGridOptions = {
    title: '',
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
            { field: 'Professiontitles', title: '职称', width: 80, sortable: false }

        ]],
    singleSelect: false,
    toolbar: '#chooseStudentToolbar',
    sortName: 'Name',
    sortOrder: 'desc',
    rownumbers: true,
    pagination: false,
    loader: function (param, success, error) {
        var studentData = {
            page: 1,
            rows:600,
            order: '',
            sort: '',
            studentBo: { SchoolId: $.cookie('SchoolId') }
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

    }
};

//点击“选择学员”按钮
function chooseStudent() {

    //选择单位下拉数据绑定 
    getAllSchool("ddlChooseSchool", true);

    openDialog('chooseStudentDlg', {
        title: '选择学员',
        iconCls: 'icon-add',
        onOpen: function () {
            //初始化列表组件
            iniDataGrid('chooseStudentDG', chooseStudentDataGridOptions);
        }
    });


}


function chooseStudentSearch() {

    // 选择学员列表参数设置
    // 列表参数设置
    var chooseStudentDataGridOptions = {
        title: '',
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
            { field: 'Profession', title: '专业', width: 80, sortable: false }
        ]],
        singleSelect: false,
        toolbar: '#chooseStudentToolbar',
        sortName: 'Name',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: false,
        loader: function (param, success, error) {
            var studentData = {
                page: 1,
                rows:600,
                order: '',
                sort: '',
                studentBo: {
                    SchoolId: $("#ddlChooseSchool").combobox('getValue')
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

        },
        onDblClickRow: function (rowIndex, rowData) {

        }
    };

    //初始化列表组件
    iniDataGrid('chooseStudentDG', chooseStudentDataGridOptions);
}

//获取所有学校数据，用于绑定下拉框
function getAllSchool(ddlRoute, isSimpleSearch) {
    var webserviceUrl = '/WebServices/Parameter/School.asmx/GetAllSchoolNew';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                // 如果是搜索条件用的dll，那么加入请选择选项
                data.unshift({ 'Id': 0, 'SchoolName': '请选择' });
            }
            initCombobox(ddlRoute, "Id", "SchoolName", data, true);
        }
    });
}

function chooseStudentData() {

    //检测学员是否重复选择
    var studentManageDataRows = $("#studentManageDG").datagrid('getData').rows;
    var studentNameArr = [];
    var chooseStudentRows = $('#chooseStudentDG').datagrid('getSelections');
    for (var csi = 0; csi < chooseStudentRows.length; csi++) {
        var chooseStudentRow = chooseStudentRows[csi];

        $.each(studentManageDataRows, function (index, studentManageDataRow) {
            if (chooseStudentRow.Id == studentManageDataRow.StudentId) {
                studentNameArr.push(chooseStudentRow.Name);
            }
        });
    }


    //添加新学员
    var idArr = [];
    var rows = $('#chooseStudentDG').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        idArr.push(row.Id);
    }

    var ids = idArr.join(',');

    var studentData = {
        ids: ids,
        studentBo: {
            CourseId: $("#HsmCourseId").val()
        }
    };

    var paramStr = JSON.stringify(studentData);

    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/BatchAddCourseStudent',
        data: paramStr,
        success: function (data) {
            if (data == true) {
                msgShow('提示', '选择学员成功', 'info');
                closeFormDialog('chooseStudentDlg');
                refreshTable('studentManageDG');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });
    return false;
}

