/***********************************
授课教师信息
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '授课教师信息',
        columns: [[
            { field: 'SchoolName', title: '学校名称', width: 60, sortable: false },
            { field: 'TeacherName', title: '教师姓名', width: 180, sortable: false },
            { field: 'TrainType', title: '课程类型', width: 100, sortable: false },
            { field: 'CourseName', title: '授课内容', width: 100, sortable: false },
            { field: 'TimeStart', title: '开始时间', width: 70, sortable: false,
                formatter: function (value) {
                    value.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
                    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                }
            },
            { field: 'TimeEnd', title: '结束时间', width: 70, sortable: false,
                 formatter: function (value) {
                     value.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
                     return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                 }
             },
            { field: 'Period', title: '授课课时', width: 60, sortable: false }
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'SchoolName',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var couserData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                courseBo: {}
            };
            var paramStr = JSON.stringify(couserData);

            ajaxCRUD({
                url: '/WebServices/Course/AllCourseServices.asmx/GetTeacherMessage',
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


function Search() {
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var couserData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                courseBo: {
                    SchoolName: $("#txtSchoolName").val().trim(),
                    TeacherName: $("#txtTeacherName").val().trim()
                }
            };
            var paramStr = JSON.stringify(couserData);

            ajaxCRUD({
                url: '/WebServices/Course/AllCourseServices.asmx/GetTeacherMessage',
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

