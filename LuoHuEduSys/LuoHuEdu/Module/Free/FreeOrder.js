/***********************************
/* 创建人：wsl
/* 修改人：wk
/* 修改日期：2013-5-16
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
var referenceModules = $.merge(['jqCookie'], easyloader.defaultReferenceModules);
using(referenceModules, function () {

    // 列表参数设置
    var dataGridCartions = {
        title: '自由行订单',
        columns: [[
        { field: 'FoId', title: "ID", checkbox: true },
            { field: 'No', title: "订单号", width: 130, sortable: false },
            { field: 'ToltalMoney', title: "订单金额", width: 80, sortable: false },
            { field: 'Stat', title: "订单状态", width: 80, sortable: false,
                formatter: function (value) {
                    if (value == 0)
                        return '<span style="color:red">未付款</span>';
                    if (value == 1)
                        return '<span style="color:green">已付款</span>';
                    if (value == 2)
                        return '<span style="color:red">退单</span>';
                }
            },
            { field: 'Contact', title: "联系人", width: 80, sortable: false },
            { field: 'ContactWay', title: "联系方式", width: 90, align: 'left', sortable: false },
            { field: 'OrderDateStr', title: "发车时间", width: 120, align: 'left', sortable: false },
            { field: 'PayType', title: "支付方式", width: 80, align: 'left', sortable: false },
             { field: 'AdultNum', title: "成年人人数", width: 80, sortable: false },
            { field: 'ChildNum', title: "儿童人数", width: 80, sortable: false },
            { field: 'ElderNum', title: "长者人数", width: 80, sortable: false },
            { field: 'StrCreatedOn', title: "下单日期", width: 80, sortable: false },
            { field: 'CreatedBy', title: "下单人", width: 80, sortable: false }
            ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'CreatedOn',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var freeData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                freeorderBo: {}
            };
            var paramStr = JSON.stringify(freeData);

            ajaxCRUD({
                url: '/WebServices/FreeWebService/FreeOrderWebService.asmx/GetFreeOrders',
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
            fillForm(rowData.Identification);
        }
    };

    //初始化列表组件
    iniDataGrid('dg', dataGridCartions);
    setSearchVal(0);

});

//easyloader.defaultTime为700ms
setTimeout(loadPartialHtml, easyloader.defaultTime);

function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: '',
            onLoad: function () {
                
            }
        });
    }
}

var moduleName = '自由行订单-';

//点击“编辑”按钮
function editData() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '编辑', '请选择要编辑的一行数据', '');
    } else {
        resetFormAndClearValidate('ff');
        fillForm(row.Identification);
    }
}

//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    ajaxCRUD({
        url: '',
        data: "{FoId:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '编辑',
                iconCls: 'icon-edit'
            });
            data.HidNo = data.No;
            //JSON数据填充表单
            loadDataToForm('ff', data);
        }
    });
}

//批量删除前台提示
function deleteDatas() {
    deleteItems('dg', deleteDatasAjax);
}

//批量删除后台AJAX处理
function deleteDatasAjax(str) {
    ajaxCRUD({
        url: '',
        data: "{FoId:'" + str + "'}",
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
    var dataGridCartions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var freeData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                freeorderBo: {
                    No: $("#txtNoSearch").val()
                }
            };
            var paramStr = JSON.stringify(freeData);

            ajaxCRUD({
                url: '/WebServices/FreeWebService/FreeOrderWebService.asmx/GetFreeOrders',
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
    iniDataGrid('dg', dataGridCartions);

    setSearchVal(1);
}

//关闭弹出层
function closeFormDialog() {
    closeDialog('dlg');
}


//----------------高级搜索开始---------------------

function openAdvancedSearch() {
    var eastPanel = $('#layout').layout('panel', 'east');
    if (eastPanel.length == 0) {
        var options = {
            region: 'east',
            split: true,
            width: 220,
            closable: true,
            title: '高级搜索',
            href: '/View/Free/FreeAdvancedSearch.htm',
            onClose: function () {
                $('#layout').layout('remove', 'east');
            },
            onLoad: function () {
                clearSearchCriteria();
            }
        };

        $('#layout').layout('add', options);

        $('.layout-panel-east .panel-tool .layout-button-right').remove();

    } else {
        $('#layout').layout('remove', 'east');
    }

}

function advancedSearch() {
    
    var form2JsonObj = form2Json("advancedSearch");

    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var freeorderData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                freeorderBo: form2JsonObj
            };

            var paramStr = JSON.stringify(freeorderData);

            ajaxCRUD({
                url: '/WebServices/FreeWebService/FreeOrderWebService.asmx/GetFreeOrders',
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
    setSearchVal(2);
}

//清除高级搜索的条件
function clearSearchCriteria() {
    clearForm('advancedSearch');
}

//--------------------------高级搜索结束------------------------------------


// 导出excel （add by jjx on 2013-12-27）
function exportExcel() {
    var datarows = $("#dg").datagrid("getRows").length;
    if (datarows <= 0) {
        $.messager.alert('自由行订单列表—导出', '<center>没有要导出的数据</center>');
        return;
    }
    location.href = "/Export/WebService/ExportExcelWebService.asmx/ExportFreeOrder?data=" + $.cookie("searchData");

}
// 存储搜索的数据于cookie中
function setSearchVal(searchStatus) {
    var data = {};
    switch (searchStatus) {
        case 0:
            data = { bo: {} };
            break;
        case 1:
            data = { bo: { No: $("#txtNoSearch").val()} };
            break;
        case 2:
            var form2JsonObj = form2Json("advancedSearch");
            data = { bo: form2JsonObj };
            break;
        default:
            break;
    }
    return $.cookie("searchData", encodeURI(JSON.stringify(data)));
}


