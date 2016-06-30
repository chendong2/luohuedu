/***********************************
/* 创建人：jjx
/* 修改日期：2014-01-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '学员管理',
        columns: [[
            { field: 'Name', title: '姓名', width: 80, sortable: false },
            { field: 'RegistrationCode', title: '市注册码', width: 100, sortable: false },
            { field: 'Sex', title: '性别', width: 60, sortable: false ,
                formatter: function (value) {
                    if (value == "1") {
                        return "男";
                    } else {
                        return "女";
                    }
                }
            },
            { field: 'Profession', title: '专业', width: 80, sortable: false },
            { field: 'SchoolName', title: '单位', width: 80, sortable: false },
            { field: 'Countc', title: '培训科目数', width: 100, sortable: false },
            { field: 'jizhong', title: '集中培训课时', width: 100, sortable: false },
            { field: 'xiaoben', title: '校本培训课时', width: 100, sortable: false },
            { field: 'zx', title: '专项培训课时', width: 100, sortable: false },
            { field: 'xueli', title: '学历培训课时', width: 100, sortable: false },
            { field: 'exTime', title: '免修管理课时', width: 100, sortable: false },
            { field: 'maTime', title: '校本研修课时', width: 100, sortable: false },
            { field: 'total', title: '课时汇总', width: 100, sortable: false }
            
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
                studentBo: {
                    TheYear: $("#sTheYear").val()
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Admin/Student.asmx/GetStudentCourseList',
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

getAllSchool();
getTheYear();

//获取年份数据
function getTheYear() {
    var currentYear = new Date().getFullYear();
    $("#sTheYear").empty();
    for (var i = 1; i <= 15; i++) {
        var data = currentYear - i + "-" + (currentYear - i + 1);
        var option = "<option value='" + data + "'>" + data + "</option>";
        $("#sTheYear").append(option);
    }
}


//获取全部的免修数据
function getAllSchool() {
    $("#sSchool").empty();
    var option = "<option value=''></option>";
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
                    TheYear: $("#sTheYear").val(),
                    SchoolId: $("#sSchool").val()
                }
            };
            var paramStr = JSON.stringify(studentData);

            ajaxCRUD({
                url: '/WebServices/Admin/Student.asmx/GetStudentCourseList',
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


