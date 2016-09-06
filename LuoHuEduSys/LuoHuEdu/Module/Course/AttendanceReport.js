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
            { field: 'Name', title: '学员姓名', width: 80 },
            { field: 'CourseName', title: '课程名称', width: 200 },
            { field: 'TheYear', title: '年度', width: 80 },
            { field: 'TimeStart', title: '课程开始时间', width: 120 },
            { field: 'TimeEnd', title: '课程结束时间', width: 120 },
            { field: 'Period', title: '学时', width: 80 },
            { field: 'SignDate', title: '签到时间', width: 120, formatter: function (value) {
                if (value == "0001/1/1 0:00:00")
                    return '<span></span>';
                else
                    return value;
            }
            },
            { field: 'SignOutDate', title: '签退时间', width: 120, formatter: function (value) {
                if (value == "0001/1/1 0:00:00")
                    return '<span></span>';
                else
                    return value;
            }
            },
            { field: 'Sign', title: '是否签到', width: 80, formatter: function (value) {
                if (value == 1)
                    return '<span>未签到</span>';
                else
                    return '<font>已签到</font>';
            }
            },
            { field: 'IsCalculate', title: '是否计算', width: 80, formatter: function (value) {
                if (value == 1)
                    return '<span>需要计算</span>';
                else
                    return '<font>不计算</font>';
            }
            }
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'CourseName',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            //alert();
            var studentData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                attendanceReportBo: {}
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseStudentNew',
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
            href: '/View/AttendanceReport/CourseForm.htm',
            onLoad: function () {
            }
        });
    }
}

//点击“编辑”按钮
function editData() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow('考勤信息编辑', '请选择要编辑的一行数据', '');
    } else {
        resetFormAndClearValidate('ff');
        fillForm(row.Id);
    }
}


function fillForm(id) {

    ajaxCRUD({
        url: '/WebServices/Course/CourseWebServices.asmx/GetCourseStudentById',
        data: "{id:'" + id + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: '编辑考勤信息',
                iconCls: 'icon-edit'
            });
            //JSON数据填充表单
            loadDataToForm('ff', data);
            $("#sIsCalculate").val(data.IsCalculate);
        }
    });
}


//保存表单数据
function saveData() {
    if (!formValidate('ff')) {
        return;
    }

    var formUrl = '/WebServices/Course/CourseWebServices.asmx/UpdatePeroid';

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{courseStudentBo:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            var msg = "修改成功"; //修改
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
                attendanceReportBo: {CourseName: $("#txtCourseName").val().trim(),
                    Name:$("#txtName").val().trim()}
               
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseStudentNew',
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
