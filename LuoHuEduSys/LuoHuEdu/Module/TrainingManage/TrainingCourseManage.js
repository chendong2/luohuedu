/***********************************
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
            {field:
                'opt',
                title: '报名设置',
                width: 50,
                formatter: function(value, rec) {
                    var btn = '<a class="editcls" onclick="registerSet(\''+ rec.Id +'\')" href="javascript:void(0)">报名设置</a>';
                    return btn;
                }
            },
            {field:'Aduit', title:'审核',width:50,  
                formatter: function(value, rec) {
                    var btn = '<a class="editcls" onclick="courseAudit(\'' + rec.Id + '\')" href="javascript:void(0)">审核</a>';
                    return btn;
                } 
            },
             { field: 'Lock', title: '锁定', width: 50,
                 formatter: function (value, rec) {
                     var btn = '<a class="editcls" onclick="editData1()" href="javascript:void(0)">锁定</a>';
                     return btn;
                 }
             },
            { field: 'Report', title: '报表', width: 50,
                formatter: function (value, rec) {
                    var btn = '<a class="editcls" onclick="editData1()" href="javascript:void(0)">查看</a>';
                    return btn;
                }
            },
            {field: 'Manage', title: '管理', width: 50,
                formatter: function (value, rec) {
                    var btn = '<a class="editcls" onclick="editData1()" href="javascript:void(0)">管理</a>';
                    return btn;
                }
            },
            { field: 'CourseName', title: '课程名称', width: 150 },
            { field: 'TheYear', title: '年度', width: 150 },
            { field: 'TrainType', title: '培训类型', width: 140 },

            { field: 'SubjectName', title: '培训科目', width: 80 },
            { field: 'Phone', title: '联系电话', width: 80 },
            { field: 'Period', title: '学时', width: 80 },
            { field: 'Cost', title: '培训费用', width: 80 },
            { field: 'SetCheck', title: '考勤设定', width: 50 },
            { field: 'IsMust', title: '种类', width: 60, formatter: function (value) {
                if (value == 1)
                    return '<span>选修</span>';
                else
                    return '<font>必修</font>';
            }
            },

            { field: 'Address', title: '培训地址', width: 70, sortable: true },
            { field: 'MaxNumber', title: '额定人数', width: 60, sortable: true },
            { field: 'SetApply', title: '超出额定人数设定', width: 80 },
            { field: 'SchoolName', title: '组织单位名称', width: 80 },
            { field: 'TimeStartStr', title: '培训开始', width: 50 },
            { field: 'TimeEndStr', title: '培训结束', width: 50 },
            { field: 'CourseCode', title: '课程代码', width: 50 }

        ]],
        singleSelect: false,
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
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseList',
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

//预先加载表单页面，提升打开表单弹出层的性能
function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: '/View/TrainingManage/TrainingCourseManage/TrainingCourseForm.htm',
            onLoad: function () {
                //                setValidatebox('Name', {
                //                    validType: "unique['WebServices/AdminWebService/JobWebService/JobWebService.asmx/CheckUniqueByJobName','JobName','JobName','jobName','岗位名称']"
                //                });
            }
        });
        panel('registerSetTemplate', {
            href: '/View/TrainingManage/TrainingCourseManage/RegisterSet.htm',
            onLoad: function () {
                
            }
        });
        panel('courseAuditFormTemplate', {
            href: '/View/TrainingManage/TrainingCourseManage/CourseAudit.htm',
            onLoad: function () {

            }
        });
    }
}



var moduleName = '培训课程管理-';

//点击“新增”按钮
function addData() {
    openDialog('dlg', {
        title: moduleName + '新增',
        iconCls: 'icon-add'
    });
    getAllTrainType("ddlTrainType", true);
    getAllSchool("ddlOrganizationalName",true );
    getTheYear();
    getAllSubject("Subject", true);
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
    getAllTrainType("ddlTrainType", true);
    getAllSchool("ddlOrganizationalName", true);
    getAllSubject("Subject", true);
    getTheYear();
    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/GetCourseById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '编辑',
                iconCls: 'icon-edit'
            });
            $("#HidName").val(data.SubjetName);
            //JSON数据填充表单
            loadDataToForm('ff', data);
            var bir = $("#txtBirthday").val();
            bir.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a); });
            $("#txtBirthday").val(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
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

    var hidValue = $("#Hid").val();
    var basicUrl = '/WebServices/Course/CourseWebServices.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateCourse"; //修改
    } else {
        wsMethod = "AddCourse"; //新增
    }
    
    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{courseBo:" + form2JsonStr + "}";
    //console.log(jsonDataStr);
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
                    Name: $("#txtName").val().trim(),
                    IDNo: $("#txtIDNo").val().trim(),
                    SchoolName: $("#txtSchoolName").val().trim()
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseList',
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

    //获取所有公办学校
    getAllPublicSchool();
    //获取所有民办学校
    getAllPrivateSchool();

    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/GetCourseById',
        data: "{id:'" + courseid + "'}",
        success: function (data) {
            
            openDialog('registerSetDlg', {
                title: '报名设置',
                iconCls: 'icon-edit'
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
            $.each(dataList,function (index, schoolBo) {
                var trHtml = '<tr><td class="td_right"><input type="checkbox" name="PlcSchool" value="' + schoolBo.Id + '"/></td><td class="td_left">' + schoolBo.SchoolName + '</td></tr>';
                $('#PublicSchoolTbl').empty();
                $('#PublicSchoolTbl').append(trHtml);
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
            $.each(dataList, function (index, schoolBo) {
                var trHtml = '<tr><td class="td_right"><input type="checkbox" name="PriSchool" value="' + schoolBo.Id + '"/></td><td class="td_left">' + schoolBo.SchoolName + '</td></tr>';
                $('#PrivateSchoolTbl').empty();
                $('#PrivateSchoolTbl').append(trHtml);
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