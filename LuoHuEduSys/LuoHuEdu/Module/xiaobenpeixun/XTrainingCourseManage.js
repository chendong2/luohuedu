﻿/***********************************
/* 创建人：Laq
/* 修改日期：2016-05-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '培训课程管理',
        columns: [[
            { field: 'Id', checkbox: true },

            {field: 'Manage', title: '管理', width:60,
                formatter: function (value, rec) {
                    var btn = '<a class="editcls" onclick="studentManage(\'' + rec.Id + '\')" href="javascript:void(0)">学员管理</a>';
                    return btn;
                }
            },
            { field: 'kaoqing', title: '考勤管理', width: 80,
                formatter: function (value, rec) {
                    var btn = '<a class="editcls" onclick="kaoQing(\'' + rec.Id + '\')" href="javascript:void(0)">考勤</a>';
                    return btn;
                }
            },
            { field: 'CourseName', title: '课程名称', width: 180 },
              { field: 'CourseState', title: '状态', width:100, formatter: function (value) {
                  if (value == 1)
                      return '<span style="red">待审核状态</span>';
                  else if (value == 2)
                      return '<span>审核通过并开放</span>';
                  else if (value == 3)
                      return '<span>审核不通过</span>';
                  return '<span style="red">待审核状态</span>';
              }
          },
             { field: 'Locked', title: '状态', width: 100, formatter: function (value) {
                 if (value == 1)
                     return '<span style="red">已锁定</span>';
                 else if (value == 2)
                     return '<span>未锁定</span>';
                 else 
                     return '<span>未设置</span>';
             }
             },
            { field: 'TheYear', title: '年度', width: 150 },
            { field: 'TrainType', title: '培训类型', width: 140 },
            { field: 'SubjectName', title: '培训科目', width: 80 },
            { field: 'Phone', title: '联系电话', width: 80 },
            { field: 'Period', title: '学时', width: 80 },
            { field: 'Cost', title: '培训费用', width: 80 },
            { field: 'IsMust', title: '种类', width: 60, formatter: function (value) {
                if (value == 1)
                    return '<span>选修</span>';
                else
                    return '<span>必修</span>';
            }
            },
            { field: 'Address', title: '培训地址', width: 130, sortable: true },
            { field: 'MaxNumber', title: '额定人数', width: 60, sortable: true },
            { field: 'SchoolName', title: '组织单位名称', width: 100 },
            { field: 'TimeStartStr', title: '培训开始', width: 120 },
            { field: 'TimeEndStr', title: '培训结束', width: 120 },
            { field: 'CourseCode', title: '课程代码', width: 80 }

        ]],
        singleSelect: true,
        toolbar: '#toolbar',
        sortName: 'CourseDate',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var courseData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                courseBo: {}
            };
            var paramStr = JSON.stringify(courseData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseListNew',
                data: paramStr,
                success: function (data) {
                    success(data);
                    getTheYearSerch();
                 
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

//获取年份数据，用于绑定下拉框
function getTheYearSerch() {
    var currentYear = new Date().getFullYear();
    $("#TheYearSerch").empty();
    var aa = currentYear + "-" + (currentYear + 1);
    var option1 = "<option  value='" + aa + "'>" + aa + "</option>";
    $("#TheYearSerch").append(option1);
    for (var i = 1; i <= 15; i++) {
        var data = currentYear - i + "-" + (currentYear - i + 1);
        var option = "<option  value='" + data + "'>" + data + "</option>";
        $("#TheYearSerch").append(option);
    }
}
//easyloader.defaultTime为700ms
setTimeout(loadPartialHtml, easyloader.defaultTime);

//预先加载表单页面，提升打开表单弹出层的性能
function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: '/View/xiaobenyanxiu/XiaoBenTrainingCourseForm.htm',
            onLoad: function () {
            }
        });
        panel('registerSetTemplate', {
            href: '/View/xiaobenyanxiu/XiaoBenRegisterSet.htm',
            onLoad: function () {
                //获取所有公办学校
                getAllPublicSchool();
                //获取所有民办学校
                getAllPrivateSchool();
            }
        });
        panel('courseAuditFormTemplate', {
            href: '/View/xiaobenyanxiu/XiaoBenCourseAudit.htm',
            onLoad: function () {

            }
        });
        panel('studentManageTemplate', {
            href: '/View/xiaobenyanxiu/XiaoBenStudentManage.htm',
            onLoad: function () {

            }
        });
        panel('kqTemplate', {
            href: '/View/xiaobenyanxiu/XiaoBenKaoqingList.htm',
             onLoad: function () {

            }
        });
        panel('chooseStudentTemplate', {
            href: '/View/xiaobenyanxiu/XiaoBenChooseStudent.htm',

            onLoad: function () {

            }
        });
    }
}



var moduleName = '校本培训-';

//点击“新增”按钮
function addData() {
    openDialog('dlg', {
        title: moduleName + '新增',
        iconCls: 'icon-add'
    });
    $("#ddlTrainType").combobox({ disabled: true });
    getAllSchool("ddlOrganizationalName", true);
    getAllSchool("ddlSchoolName", true);
    var data = [];
    data.push({ "Name": "请选择", "Id": 0 });
    initCombobox("ddlTeacherId", "Id", "Name", data, true);
    getTheYear();
    getAllSubject("Subject", true);
    resetFormAndClearValidate('ff');
}

//点击“编辑”按钮
function editData() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '编辑', '请选择要编辑的一行数据！', '');
    }
    else if (row.CourseState == 2) {
        msgShow(moduleName + '编辑', '审核通过或则锁定的课程不能编辑！', '');
    }
    else if (row.Locked == 1) {
        msgShow(moduleName + '编辑', '锁定的课程不能编辑！', '');
    }
    else {

        resetFormAndClearValidate('ff');
        fillForm(row.Id);
    }
}

//点击“编辑”按钮
function editData1() {
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
    //getAllTrainType("ddlTrainType", true);
    getAllSchool("ddlOrganizationalName", true);
    getAllSchool("ddlSchoolName", true);
    getAllSubject("Subject", true);
    getTheYear();
//    getAllStudent("ddlTeacherId", true);
    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/GetCourseById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '编辑',
                iconCls: 'icon-edit'
            });
            $("#HidName").val(data.SubjetName);
            $('#txtTimeStart').datebox('setValue', data.TimeStartStr);
            $('#txtTimeEnd').datebox('setValue', data.TimeEndStr);
            //JSON数据填充表单
            loadDataToForm('ff', data);

            ajaxCRUD({
                async: false,
                url: '/WebServices/Admin/Student.asmx/GetAllStudentById',
                data: "{id:'" + data.TeacherId + "'}",
                success: function (data1) {
                    // 如果是搜索条件用的dll，那么加入请选择选项
                    $("#ddlSchoolName").combobox('setValue', data1.SchoolId);
                }
            });


            $("#ddlTeacherId").combobox('setValue', data.TeacherId);
        }
    });
}


//获取年份数据，用于绑定下拉框
function getTheYear() {
    var currentYear = new Date().getFullYear();
    $("#TheYear").empty();
    var aa = currentYear + "-" + (currentYear + 1);
    var option1 = "<option  value='" + aa + "'>" + aa + "</option>";
    $("#TheYear").append(option1);
    for (var i = 1; i <= 15; i++) {
        var data = currentYear - i + "-" + (currentYear - i + 1);
        var option = "<option  value='" + data + "'>" + data + "</option>";
        $("#TheYear").append(option);
    }
   
}

//获取所有学校数据，用于绑定下拉框
function getAllSchool(ddlRoute, isSimpleSearch) {
    var webserviceUrl = '/WebServices/Parameter/School.asmx/GetAllSchoolNew';
    $("#sSchool").empty();
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


//保存表单数据
function saveData() {
    if (!formValidate('ff')) {
        return;
    }

    var hidValue = $("#HtcId").val();
    var basicUrl = '/WebServices/Course/CourseWebServices.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateCourse"; //修改
    } else {
        wsMethod = "AddCourseXiaoBen"; //新增
    }
    
    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    form2JsonObj.SchoolId = $.cookie('SchoolId');
    form2JsonObj.OrganizationalName = $.cookie('SchoolId');
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{courseBo:" + form2JsonStr + "}";
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
                closeFormDialog('dlg');
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
        url: '/WebServices/Course/CourseWebServices.asmx/DeleteCousrseByIds',
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
            var studentData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                courseBo: {
                    TheYear: $("#TheYearSerch").val().trim(),
                    CourseName: $("#txtCourseName").val().trim()

                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseListNew',
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

//点击“报名设置”按钮
function registerSet(courseid) {

    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/GetCourseById',
        data: "{id:'" + courseid + "'}",
        success: function (data) {

            openDialog('registerSetDlg', {
                title: '报名设置',
                iconCls: 'icon-edit',
                onOpen: function () {

                }
            });
            
            //JSON数据填充表单
            loadDataToForm('registerSetForm', data);
        }
    });

}

//保存“报名设置”表单数据
function saveRegisterSetData() {
    
//    if (!formValidate('registerSetForm')) {
//        return;
//    }
    var basicUrl = '/WebServices/Course/CourseWebServices.asmx/ApplySet';

    var form2JsonObj = form2Json("registerSetForm");
    //alert(form2JsonObj.TeachingObject);
    if (form2JsonObj.TeachingObject && $.isArray(form2JsonObj.TeachingObject)) {
        form2JsonObj.TeachingObject = form2JsonObj.TeachingObject.join(',');
    }

    if (form2JsonObj.ObjectEstablish && $.isArray(form2JsonObj.ObjectEstablish)) {
        form2JsonObj.ObjectEstablish = form2JsonObj.ObjectEstablish.join(',');
    }

    if (form2JsonObj.ObjectSubject && $.isArray(form2JsonObj.ObjectSubject)) {
        form2JsonObj.ObjectSubject = form2JsonObj.ObjectSubject.join(',');
    }

    if (form2JsonObj.PlcSchool && $.isArray(form2JsonObj.PlcSchool)) {
        form2JsonObj.PlcSchool = form2JsonObj.PlcSchool.join(',');
    }

    if (form2JsonObj.PriSchool && $.isArray(form2JsonObj.PriSchool)) {
        form2JsonObj.PriSchool = form2JsonObj.PriSchool.join(',');
    }
    

    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{courseBo:" + form2JsonStr + "}";
    
    //console.log(jsonDataStr);
    
    ajaxCRUD({
        url: basicUrl,
        data: jsonDataStr,
        success: function (data) {
            if (data == true) {
                msgShow('提示', '修改成功', 'info');
                closeFormDialog('registerSetDlg');
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });
    
} //saveRegisterSetData

//获取所有公办学校信息，用于多选框绑定数据
function getAllPublicSchool() {
    var webserviceUrl = '/WebServices/Parameter/School.asmx/GetPlcSchoolByType';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (dataList) {
            $('#PublicSchoolTbl').empty();
            var tdArr = new Array();
            $.each(dataList, function (index, schoolBo) {

                //索引为偶数时则清除数组
                if (index % 2 == 0) {
                    tdArr.splice(0, tdArr.length);
                }

                var tdHtml = '<td class="td_right"><input type="checkbox" name="PlcSchool" value="' + schoolBo.Id + '"/></td><td class="td_left">' + schoolBo.SchoolName + '</td>';
                tdArr.push(tdHtml);

                //索引为奇数时则添加一行
                if (index % 2 != 0) {
                    $('#PublicSchoolTbl').append('<tr>' + tdArr.join('') + '</tr>');
                }
            });
        }
    });
}

//获取所有民办学校信息，用于多选框绑定数据
function getAllPrivateSchool() {
    var webserviceUrl = '/WebServices/Parameter/School.asmx/GetPriSchoolByType';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',//
        success: function (dataList) {
            $('#PrivateSchoolTbl').empty();
            var tdArr = new Array();
            $.each(dataList, function (index, schoolBo) {

                //索引为偶数时则清除数组
                if (index % 2 == 0) {
                    tdArr.splice(0, tdArr.length);
                }
                
                var tdHtml = '<td class="td_right"><input type="checkbox" name="PriSchool" value="' + schoolBo.Id + '"/></td><td class="td_left">' + schoolBo.SchoolName + '</td>';
                tdArr.push(tdHtml);

                //索引为奇数时则添加一行
                if (index % 2 != 0) {
                    $('#PrivateSchoolTbl').append('<tr>' + tdArr.join('') + '</tr>');
                }
            });
        }
    });
}

//点击“审核”按钮
function courseAudit(courseid) {
    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/GetCourseById',
        data: "{id:'" + courseid + "'}",
        success: function (data) {
            openDialog('courseAuditDlg', {
                title: '课程审核',
                iconCls: 'icon-edit'
            });

            //JSON数据填充表单
            loadDataToForm('courseAuditForm', data);
        }
    });
}

//保存“课程审核”表单数据
function saveCourseAuditSetData() {

    //    if (!formValidate('courseAuditForm')) {
    //        return;
    //    }
    
    var basicUrl = '/WebServices/Course/CourseWebServices.asmx/AduitSet';
    var form2JsonObj = form2Json("courseAuditForm");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{courseBo:" + form2JsonStr + "}";
    //console.log(jsonDataStr);

    ajaxCRUD({
        url: basicUrl,
        data: jsonDataStr,
        success: function (data) {
            if (data == true) {
                msgShow('提示', '修改成功', 'info');
                closeFormDialog('courseAuditDlg');
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });

} //saveCourseAuditSetData


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
                sort:'',
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
                page:1,
                rows:600,
                order: '',
                sort:'',
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
            sort:'',
            studentBo: {  }
        };
        var paramStr = JSON.stringify(studentData);

        ajaxCRUD({
            url: '/WebServices/Admin/Student.asmx/GetStudentListAAA',
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
        onOpen:function () {
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
                studentBo: {
                    SchoolId: $("#ddlChooseSchool").combobox('getValue')
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Admin/Student.asmx/GetStudentListNew',
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
        ids:ids,
        studentBo : {
            CourseId :$("#HsmCourseId").val()
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
}


var cousrIdCD="";
//点击“学员管理”按钮
function kaoQing(id) {

    cousrIdCD = id;
    // 列表参数设置
    var kqDataGridOptions = {

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
            { field: 'SchoolName', title: '学校名称', width: 80, sortable: false },
            { field: 'Office', title: '职务', width: 80, sortable: false },
            { field: 'Telephone', title: '手机', width: 80, sortable: false },
            { field: 'Period', title: '学分', width: 80, sortable: false },
            { field: 'Sign', title: '状态', width: 80, sortable: false,
                formatter: function (value) {
                    if (value == "1") {
                        return "未签";
                    } else {
                        return "已签";
                    }
                }
            },
            { field: 'Sign1', title: '操作', width: 80, sortable: false,
                formatter: function (value, rec) {
                    if (rec.Sign == "1") {
                        return '<a style="color:red;cursor:pointer" onclick="qiandao(\'' + rec.Id + '\')" href="javascript:void(0)">签到</a>';
                    } else {
                        return '<a style="color:red;cursor:pointer" onclick="quxiao(\'' + rec.Id + '\')" href="javascript:void(0)">取消签到</a>';
                    }
                }
            }
        ]],
        singleSelect: false,
        toolbar: '#KaoqingToolbar',
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
                studentBo: {
                    courseId: cousrIdCD
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Admin/Student.asmx/GetKaoqingList',
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
    openDialog('kgDlg', {
        title: '考勤管理',
        iconCls: 'icon-edit',
        onOpen: function () {
            //初始化列表组件
            //getAllCDSchool();
            iniDataGrid('kgDG', kqDataGridOptions);
        }
    });

}

function KaoqingSearch() {

    // 列表参数设置
    var kqDataGridOptions = {

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
            { field: 'SchoolName', title: '学校名称', width: 80, sortable: false },
            { field: 'Office', title: '职务', width: 80, sortable: false },
            { field: 'Telephone', title: '手机', width: 80, sortable: false },
            { field: 'Period', title: '学分', width: 80, sortable: false },
            { field: 'Sign', title: '状态', width: 80, sortable: false,
                formatter: function (value) {
                    if (value == "1") {
                        return "未签";
                    } else {
                        return "已签";
                    }
                }
            },
            { field: 'Sign1', title: '操作', width: 80, sortable: false,
                formatter: function (value, rec) {
                    if (rec.Sign == "1") {
                        return '<a style="color:red;cursor:pointer" onclick="qiandao(\'' + rec.Id + '\')" href="javascript:void(0)">签到</a>';
                    } else {
                        return '<a style="color:red;cursor:pointer" onclick="quxiao(\'' + rec.Id + '\')" href="javascript:void(0)">取消签到</a>';
                    }
                }
            }
        ]],
        singleSelect: false,
        toolbar: '#KaoqingToolbar',
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
                studentBo: {
                    Name: $("#txtCDName").val().trim(),
                    courseId: cousrIdCD
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Admin/Student.asmx/GetKaoqingList',
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

    iniDataGrid('kgDG', kqDataGridOptions);

}
function PrintBaoMing() {
    window.open("/View/TrainingManage/TrainingCourseManage/KaoqingPrint.htm?courseId=" + cousrIdCD);
}

function qiandao(id) {
    ajaxCRUD({
        url: '/WebServices/Admin/Student.asmx/StudentQianDao',
        data: "{id:'" + id + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '签到成功', 'info');
                refreshTable('kgDG');
            } else {
                msgShow('提示', '签到失败', 'info');
            }
        }
    });
}

//点击“编辑”按钮
function jiesuan2() {
    ajaxCRUD({
        url: '/WebServices/Admin/Student.asmx/CourseJieSuan2',
        data: "{id:'" + cousrIdCD + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '批量签到成功', 'info');
                refreshTable('kgDG');
            } else {
                msgShow('提示', '批量签到失败', 'info');
            }
        }
    });
}


//批量结算
function jiesuan() {
    ajaxCRUD({
        url: '/WebServices/Admin/Student.asmx/CourseJieSuan',
        data: "{id:'" + cousrIdCD + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '结算成功', 'info');
                refreshTable('kgDG');
            } else {
                msgShow('提示', '结算失败', 'info');
            }
        }
    });
}
function quxiao(id) {
    ajaxCRUD({
        url: '/WebServices/Admin/Student.asmx/CancelQianDao',
        data: "{id:'" + id + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '取消签到成功', 'info');
                refreshTable('kgDG');
            } else {
                msgShow('提示', '取消签到失败', 'info');
            }
        }
    });
}



