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
            { field: 'CourseName', title: '课程名称', width:150 },
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
            { field: 'Sign', title: '是否签到', width: 80 , formatter: function (value) {
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
            href: '/View/CourseStudenttemp/CourseForm.htm',
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
