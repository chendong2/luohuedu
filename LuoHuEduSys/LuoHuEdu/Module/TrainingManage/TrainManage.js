/***********************************
/* 创建人：jjx
/* 修改日期：2014-01-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '校本研修审核',
        columns: [[
            { field: 'Id', checkbox: true },
            { field: 'UserName', title: '姓名', width: 60, sortable: false },
            { field: 'TrainName', title: '项目标题', width: 180, sortable: false },
            { field: 'ProgrameName', title: '项目类型', width: 100, sortable: false },
            { field: 'SubProgrameName', title: '次项目类型', width: 100, sortable: false },
            { field: 'SunProgrameName', title: '子项目类型', width: 100, sortable: false },
            { field: 'TheYear', title: '年度', width: 70, sortable: false },
            { field: 'CreateOn', title: '申请时间', width: 70, sortable: false,
                formatter: function (value) {
                    value.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
                    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                }
            },
            { field: 'SchoolAudit', title: '学校审核', width: 70, sortable: false,
                formatter: function (value) {
                    if (value == "0") {
                        return "未审核";
                    } else if (value == "1") {
                        return "审核不通过";
                    } else {
                        return "审核通过";
                    }
                }
            },
            { field: 'DistinctSchoolAudit', title: '中心审核', width: 70, sortable: false,
                formatter: function (value) {
                    if (value == "0") {
                        return "未审核";
                    } else if (value == "1") {
                        return "审核不通过";
                    } else {
                        return "审核通过";
                    }
                }
            },
            { field: 'StuTime', title: '对应课时', width: 60, sortable: false },
            { field: 'Audit', title: '审核', width: 70, sortable: false,
                formatter: function (value) {
                    return "<a style='color:red;cursor:pointer'>审核</a>";
                }
            }
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'UserName',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var studentTrainData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                studentTrainBo: {}
            };
            var paramStr = JSON.stringify(studentTrainData);

            ajaxCRUD({
                url: '/WebServices/UserInfo/StudentTrain.asmx/GetStudentTrainList',
                data: paramStr,
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });

        },
        onClickRow: function (rowIndex, rowData) {

            $("#sSunPro").empty();
            $("#sSubPro").empty();
            getTheYear();
            getAllTrain();
            fillForm(rowData.Id);
            fillProdata(rowData.ProgramId);
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
            href: '/View/TrainingManage/TrainManage/TrainManageForm.htm',
            onLoad: function () {
                //                setValidatebox('Name', {
                //                    validType: "unique['WebServices/AdminWebService/JobWebService/JobWebService.asmx/CheckUniqueByJobName','JobName','JobName','jobName','岗位名称']"
                //                });
            }
        });
    }
}

var moduleName = '校本研修登记-';



//获取年份数据
function getTheYear() {
    var currentYear = new Date().getFullYear();
    $("#sTheYear").empty();
    for (var i = 1; i <=15; i++) {
        var data = currentYear - i + "-" + (currentYear-i+1);
        var option = "<option disabled='disabled' value='" + data + "'>" + data + "</option>";
        $("#sTheYear").append(option);
    }
}

//获取全部的免修数据
function getAllTrain() {
    $("#sPro").empty();
    $("#sPro").append("<option value=''></option>");
    ajaxCRUD({
        url: '/WebServices/Parameter/MaintrainSet.asmx/GetAllProgram',
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var option = "<option  disabled='disabled' value='" + data[i] + "'>" + data[i] + "</option>";
                $("#sPro").append(option);
            }
        }
    });
}



function getSubTrain() {
    $("#sSubPro").empty();
    $("#sSubPro").append("<option value=''></option>");
    var pro = $("#sPro").val();
    ajaxCRUD({
        url: '/WebServices/Parameter/MaintrainSet.asmx/GetSubProgram',
        data: "{pro:'" + pro + "'}",
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var option = "<option  disabled='disabled' value='" + data[i] + "'>" + data[i] + "</option>";
                $("#sSubPro").append(option);
            }
        }
    });
}

function getSunTrain() {
    $("#sSunPro").empty();
    $("#sSunPro").append("<option value=''></option>");
    var pro = $("#sPro").val();
    var subPro = $("#sSubPro").val();
    ajaxCRUD({
        url: '/WebServices/Parameter/MaintrainSet.asmx/GetSunProgram',
        data: "{pro:'" + pro + "',subPro:'" + subPro + "'}",
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i].toString().split('******');
                var option = "<option  disabled='disabled' value='" + value[1] + "'>" + value[0] + "</option>";
                $("#sSunPro").append(option);
            }
        }
    });
}

function setData() {
    var id = $("#sSunPro").val();
    $("#HidProgramId").val(id);
}


function fillProdata(id) {
    ajaxCRUD({
        url: '/WebServices/Parameter/MaintrainSet.asmx/GetMaintrainSetById',
        data: "{id:'" + id + "'}",
        async: false,
        success: function (data) {
            $("#sPro").val(data.ProgrameName);
            getSubTrain();
            $("#sSubPro").val(data.SubProgrameName);
            getSunTrain();
            $("#sSunPro").val(id);
        }
    });
}



//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    ajaxCRUD({
        url: '/WebServices/UserInfo/StudentTrain.asmx/GetStudentTrainById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '审核',
                iconCls: 'icon-edit'
            });
            //JSON数据填充表单
            loadDataToForm('ff', data);
        }
    });
}

//保存表单数据
function saveData() {
    if (!formValidate('ff')) {
        return;
    }

    var hidValue = $("#HidId").val();
    var basicUrl = '/WebServices/UserInfo/StudentTrain.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateStudentTrain"; //修改
    } else {
        wsMethod = "AddStudentTrain"; //新增
    }

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{studentTrainBo:" + form2JsonStr + "}";

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
                closeFormDialog();
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
        url: '/WebServices/UserInfo/StudentTrain.asmx/DeleteStudentTrainsByIds',
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
            var studentTrainData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                studentTrainBo: {
                    UserName: $("#txtUserName").val().trim()
                }
            };
            var paramStr = JSON.stringify(studentTrainData);

            ajaxCRUD({
                url: '/WebServices/UserInfo/StudentTrain.asmx/GetStudentTrainList',
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
