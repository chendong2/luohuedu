/***********************************
/* 创建人：ys
/* 修改人：ys
/* 修改日期：2013-5-16
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
var referenceModules = $.merge(['jqCookie'], easyloader.defaultReferenceModules);
using(referenceModules, function () {

    // 列表参数设置
    var dataGridCartions = {
        title: '自由行套餐',
        columns: [[
        { field: 'FpId', title: "ID", checkbox: true },
            { field: 'PackageTypeStr', title: "套餐类型", width: 80, sortable: false },
            { field: 'Title', title: "套餐标题", width: 250, sortable: false },
            { field: 'StrBeginDate', title: "套餐有效期起始", width: 100, sortable: false },
            { field: 'StrEndDate', title: "套餐有效期截止", width: 100, sortable: false },
            { field: 'BeginCity', title: "出发城市", width: 75, align: 'left', sortable: false },
            { field: 'IsHot', title: "是否热门", width: 60, align: 'left', sortable: false ,
                formatter: function (value) {
                    if (value == "1") {
                        return "是";
                    } else {
                        return "否";
                    }
                }
            },
            { field: 'PriceAdultDirect', title: "直客成人价", width: 80, align: 'left', sortable: false },
            { field: 'PriceChildDirect', title: "直客孩童价", width: 80, sortable: false },
            { field: 'PriceElderDirect', title: "直客长者价", width: 80, sortable: false },
            { field: 'IsHavePass', title: "包含通行证", width: 80, sortable: false,
                formatter: function (value) {
                    if (value == "1") {
                        return "是";
                    } else {
                        return "否";
                    }
                }
            },
            { field: 'PassPrice', title: "通行证价格", width: 80, sortable: false }
            ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'CreatedOn',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var freeData = {
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                order: param.order,
                freepackageBo: {}
            };
            var paramStr = JSON.stringify(freeData);

            ajaxCRUD({
                url: '/WebServices/FreeWebService/FreeOrderWebService.asmx/GetFreePackages',
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
            fillForm(rowData.Fp_Id);
        }
    };
    //初始化列表组件
    iniDataGrid('dg', dataGridCartions);
});

//easyloader.defaultTime为700ms
setTimeout(loadPartialHtml, easyloader.defaultTime);

function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: '/View/Free/FreePackageForm.htm',
            onLoad: function () {
                $("#txtStartBanCi").timePicker({
                    startTime: new Date(0, 0, 0, 8, 0, 0), // Using string. Can take string or Date object.
                    endTime: new Date(0, 0, 0, 14, 0, 0), // Using Date object here.
                    show24Hours: true,
                    separator: ':',
                    step: 30
                });

                
            }
        });
    }
}

var moduleName = '自由行订单-';

//点击“编辑”按钮
function addFreeOrder() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '预定', '请选择要预定的自由行套餐', '');
    } else {
        resetFormAndClearValidate('ff');
        fillFormWithRowData(row);
    }
}

//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    ajaxCRUD({
        url: '/WebServices/FreeWebService/FreeOrderWebService.asmx/GetFreePackageById',
        data: "{id:'" + itemid + "'}",
        success: function (data) {
            openDialog('dlg', {
                title: moduleName + '编辑',
                iconCls: 'icon-edit'
            });
            data.HidName = data.Name;
            //JSON数据填充表单
            loadDataToForm('ff', data);
        }
    });
}

function fillFormWithRowData(rowdata) {
    openDialog('dlg', {
        title: moduleName + '预定',
        iconCls: 'icon-edit'
    });
    $("#Fp_Id").val(rowdata.FpId);
    $("#Title").text(rowdata.Title);
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

//关闭弹出层
function closeFormDialog() {
    closeDialog('dlg');
}

//自由行下单
function saveFreeOrder() {
    if (!formValidate('ff')) {
        return;
    }
    var adultNum = $("#txtAdultNum").val().trim();
    var childNum = $("#txtChildNum").val().trim();
    var elderNum = $("#txtElderNum").val().trim();

    if (adultNum == '0' && childNum == '0' && elderNum == '0') {
        msgShow("提示", "请输入有效的套餐信息", 'info');
        return;
    }
    var formUrl = '/WebServices/FreeWebService/FreeOrderWebService.asmx/AddFreeOrder';
    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{bo:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            if (data == -1) {
                msgShow('提示', "请输入有效的自由行下单信息！", 'info');
            } else if (data == 1) {
                msgShow('提示', "自由行订单下单成功！", 'info');
                closeFormDialog();
                refreshTable('dg');
            } else {
                msgShow('提示', '下单失败！', 'info');
            }
        }
    });
}







