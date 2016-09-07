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
            { field: 'CourseName', title: '课程名称', width:200 },
            { field: 'YearNo', title: '年度', width: 80 },
            { field: 'CourseType', title: '课程类型', width: 80 },
            { field: 'StudyType', title: '授课方式', width: 80 },
            { field: 'Period', title: '学时', width: 80 },
            { field: 'StartDate', title: '培训开始', width: 120 },
            { field: 'EndDate', title: '培训结束', width: 120 },
            { field: 'TrainDept', title: '组织单位', width: 120 },
            { field: 'ClockTime', title: '签到时间', width: 120 }
            
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'CourseName',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var studentData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                courseStudentTempBo: {}
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseStudent',
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
                courseStudentTempBo: {CourseName: $("#txtCourseName").val().trim(),
                    Name:$("#txtName").val().trim()}
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Course/CourseWebServices.asmx/GetCourseStudent',
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
