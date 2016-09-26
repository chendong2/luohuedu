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
            { field: 'CourseName', title: '课程名称', width: 80, formatter: function (value, rec) {
                if ($.cookie('perList').indexOf("课程浏览") > -1) {
                    return '<a style="cursor:pointer" onclick="kecheng(\'' + rec.Id + '\')" href="javascript:void(0)">' + value + '</a>';
                } else {
                    return '';
                }
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
            { field: 'TheYear', title: '年度', width: 80 },
            { field: 'TrainType', title: '培训类型', width: 80 },

            { field: 'SubjectName', title: '培训科目', width: 80 },
            { field: 'Phone', title: '联系电话', width: 80 },
            { field: 'Period', title: '学时', width: 80 },
            { field: 'Cost', title: '培训费用', width: 80 },
            { field: 'SetCheck', title: '考勤设定', width: 70 },
            { field: 'IsMust', title: '种类', width: 60, formatter: function (value) {
                if (value == 1)
                    return '<span>选修</span>';
                else
                    return '<font>必修</font>';
            }
            },

            { field: 'Address', title: '培训地址', width: 70, sortable: true },
            { field: 'MaxNumber', title: '额定人数', width: 70, sortable: true },
            { field: 'SetApply', title: '超出额定人数设定', width: 100 },
            { field: 'SchoolName', title: '组织单位名称', width: 100 },
            { field: 'TimeStartStr', title: '培训开始', width: 70 },
            { field: 'TimeEndStr', title: '培训结束', width: 70 },
            { field: 'CourseCode', title: '课程代码', width: 60 }

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
                        baomingData(id);
                    } else {
                        msgShow('提示', '报名名额已满,您已无法报名！', 'info');
                    }
                }
            });
        }
    });
}

//批量删除后台AJAX处理
function baomingData(str) {
    ajaxCRUD({
        url: '/WebServices/Course/AllCourseServices.asmx/AddCourseStudent',
        data: "{userId:'" + $.cookie('UserId') + "',courseId:'" + str + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '报名成功', 'info');
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
function closeFormDialog() {
    closeDialog('dlg');
}
