﻿/***********************************
/* 创建人：jjx
/* 修改日期：2014-01-06
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
using(easyloader.defaultReferenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '免修设置',
        columns: [[
            { field: 'Id', checkbox: true },
            { field: 'ExemptionReason', title: '免修名目', width: 180, sortable: false },
            { field: 'Comment', title: '相关说明', width: 480, sortable: false }
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'ExemptionReason',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var exemptionData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                exemptionBo: {}
            };
            var paramStr = JSON.stringify(exemptionData);

            ajaxCRUD({
                url: '/WebServices/Parameter/Exemption.asmx/GetExemptionList',
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
            href: '/View/Parameter/Exemption/ExemptionForm.htm',
            onLoad: function () {
//                setValidatebox('Name', {
//                    validType: "unique['WebServices/AdminWebService/JobWebService/JobWebService.asmx/CheckUniqueByJobName','JobName','JobName','jobName','岗位名称']"
//                });
            }
        });
    }
}

var moduleName = '免修设置-';

//点击“新增”按钮
function addData() {
    openDialog('dlg', {
        title: moduleName + '新增',
        iconCls: 'icon-add'
    });
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

//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    ajaxCRUD({
        url: '/WebServices/Parameter/Exemption.asmx/GetExemptionById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '编辑',
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
    var basicUrl = '/WebServices/Parameter/Exemption.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateExemption"; //修改
    } else {
        wsMethod = "AddExemption"; //新增
    }

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{exemptionBo:" + form2JsonStr + "}";

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
        url: '/WebServices/Parameter/Exemption.asmx/DeleteExemptionsByIds',
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
            var exemptionData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                exemptionBo: {
                    ExemptionReason: $("#txtExemptionReason").val().trim()
                }
            };
            var paramStr = JSON.stringify(exemptionData);

            ajaxCRUD({
                url: '/WebServices/Parameter/Exemption.asmx/GetExemptionList',
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
