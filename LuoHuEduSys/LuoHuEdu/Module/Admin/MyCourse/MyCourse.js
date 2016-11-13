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
            { field: 'CourseName', title: '课程名称', width: 150, sortable: true },
            { field: 'TheYear', title: '年度', width: 150 },
            { field: 'TrainType', title: '培训类型', width: 140 },
            { field: 'SubjectName', title: '培训科目', width: 100 },
            { field: 'Phone', title: '联系电话', width: 80 },
            { field: 'Period', title: '学时', width: 80 },
            { field: 'HuoDePeriod', title: '获得学时', width: 80 },
            { field: 'IsMust', title: '种类', width: 60, formatter: function (value) {
                if (value == 1)
                    return '<span>选修</span>';
                else
                    return '<span>必修</span>';
            }
            },
            { field: 'Address', title: '培训地址', width: 150, sortable: true },
            { field: 'SchoolName', title: '组织单位名称', width: 80 },
            { field: 'TimeStartStr', title: '培训开始', width: 150 },
            { field: 'TimeEndStr', title: '培训结束', width: 150 }

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
                url: '/WebServices/Course/CourseWebServices.asmx/GetMyCourseList',
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

////easyloader.defaultTime为700ms
//setTimeout(loadPartialHtml, easyloader.defaultTime);


//关闭弹出层
function closeFormDialog() {
    closeDialog('dlg');
}
