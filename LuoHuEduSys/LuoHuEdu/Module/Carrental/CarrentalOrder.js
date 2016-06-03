/***********************************
/* 创建人：yzb
/* 修改人：wk
/* 修改日期：2013-5-23
/* 包含列表的绑定,增删改查
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
//列表显示字段
var colum = [
    [
        { field: 'OrderId', checkbox: true },
        { field: 'OrderNum', title: '订单号', width: 120 },
        { field: 'OrderPrice', title: '订单金额', width: 60 },
        { field: 'CurrencyType', title: '货币类型', width: 60 },
        { field: 'PaymentState', title: '付款状态', width: 60,
            formatter: function (value) {
                switch (value) {
                    case 0: return '<font color="red">未付款</font>';
                    case 1: return '<font color="green">已付款</font>';
                    default: return "";
                }
            }
        },
        { field: 'OrderState', title: '退票状态', width: 60,
            formatter: function (value) {
                switch (value) {
                    case 0: return '<font color="green">未退票</font>';
                    case 1: return '<font color="red">已退票</font>';
                    default: return "";
                }
            }
        },
         { field: 'IsOutTicket', title: '出票状态', width: 60,
             formatter: function (value) {
                 switch (value) {
                     case 0: return '<font color="red">未出票</font>';
                     case 1: return '<font color="green">已出票</font>';
                     default: return "";
                 }
             }
         },
        { field: 'TicketState', title: '核票状态', width: 60,
            formatter: function (value) {
                switch (value) {
                    case 0: return '<font color="red">未核票</font>';
                    case 1: return '<font color="green">已核票</font>';
                    default: return "";
                }
            }
        },
        { field: 'IsTranfer', title: '是否中转', width: 60,
            formatter: function (value) {
                switch (value) {
                    case 0: return '<font color="green">否</font>';
                    case 1: return '<font color="red">是</font>';
                    default: return "";
                }
            }
        },
        { field: 'TransferPrice', title: '中转补价', width: 60 },
        { field: 'TransferCurrencyType', title: '补价币种', width: 60 },
        { field: 'IsPaid', title: '中转回款', width: 60,
            formatter: function (value) {
                switch (value) {
                    case 1: return '<font color="green">已回款</font>';
                    case 2: return '<font color="red">未回款</font>';
                    default: return "";
                }
            }
        },
        { field: 'TransferOrderNum', title: '中转单号', width: 120 },
        { field: 'IsTransferPrintStr', title: '中转单打印', width: 70 },
        { field: 'LineName', title: '包车线路', width: 190 },
        { field: 'CreatedBy', title: '下单帐号', width: 60 },
        { field: 'StrCreatedOn', title: '下单日期', width: 70 },
        { field: 'OnPointName', title: '上车点', width: 90 },
        { field: 'OffPointName', title: '下车点', width: 90 },
        { field: 'StrLeaveDate', title: '出发日期', width: 110 },
        { field: 'UserName', title: '联系人', width: 60 },
        { field: 'Phone', title: '手机', width: 90 },
        { field: 'MachineNo', title: '机器号', width: 60 },
        { field: 'StrPaymentType', title: '支付方式', width: 60 },
        { field: 'StrOrderSource', title: '订单来源', width: 60 },
        { field: 'Remark', title: '订单备注', width: 100 },
        { field: 'Remarks', title: '中转备注', width: 60 },
        { field: 'CancelBy', title: '退票人', width: 60 },
        { field: 'StrCancelDate', title: '退票时间', width: 120 },
        { field: 'RefundReason', title: '退票原由', width: 150 }
    ]
];
var tabNum = 0;
var customerObject  = {Name:'',Phone:''};//全局变量,有用户呼入时写入检索条件
var referenceModules = $.merge(['jqCookie'], easyloader.defaultReferenceModules);
using(referenceModules, function () {
    var customerInfo = $.cookie('customerInfo');
    var decodeInfo = {};
    if (customerInfo != '' && typeof (customerInfo) != 'undefined' && customerInfo != null&&customerInfo!='null') {
        decodeInfo = decodeURI(customerInfo);
        customerObject = JSON.parse(decodeInfo);
        $.cookie('customerInfo', null, { path: '/' }); //删除cookie，避免非呼入用户进入列表添加上条件
    } //解析成对象
    updateTabCount(customerObject);
    $('#tabs li').click(function () {
        $("#txtOrderNum").val("");
        $('#tabs li.tabs-selected').removeClass();
        $(this).addClass("tabs-selected");
        tabsCheck($('#tabs li').index($(this)), customerObject);
    });
    //初始化数据
    $('#tabs li').first().click();
    //搜索
    $('#searchText').click(function () {
        search($("#txtOrderNum").val(), customerObject);
    });
    setSearchVal(0, customerObject);
});

setTimeout(loadPartialHtml, easyloader.defaultTime);

function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('cancelTemplate', {
            href: '/View/Carrental/CarrentalOrder/CarrentalOrderCancelForm.htm',
            onLoad: function () {
                $("#dlgCancel").dialog();
            }
        });

        panel('viewTemplate', { href: '/View/Carrental/CarrentalOrder/CarrentalOrderView.htm',
            onLoad: function () {
                $("#dlgView").dialog();
            }
        });

        panel('editTemplate', { href: '/View/Carrental/CarrentalOrder/CarrentalOrderEditForm.htm',
            onLoad: function () {
                $("#dlgEdit").dialog();
            }
        });

        panel('formTemplate', { href: '/View/Carrental/CarrentalOrder/CarrentalOrderTransfer.htm',
            onLoad: function () {
                $("#dlgTransfer").dialog();
            }
        });
    }
}
var moduleName = '中港包车订单-';

//点击“查看”按钮
function viewData() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '查看', '请选择要查看的一行数据', '');
    } else {
        fillForm(row.OrderId);
    }
}
//退票
function cancelTicket() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '退单', '请选择要退单的数据', '');
    } else if (row.OrderState == 1) {
        msgShow(moduleName + '退单', '该订单已退票', '');
    } else {
        openDialog('dlgCancel', {
            title: moduleName + '退单',
            iconCls: 'icon-no',
            onOpen: function () {
                ajaxCRUD({
                    url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetCarrentalOrderById',
                    data: "{pOrderId:'" + row.OrderId + "'}",
                    success: function (data) {
                        initTemplate("cancel-Template", data, "cancelInfo");
                        var price = data.OrderPrice;
                        $('#RefundPrice').numberbox({ required: true, min: 0, max: price });
                    }
                });
            },
            onClose: function () {
                $("#cancelInfo").html("");
            }
        });
    }
}
//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    openDialog('dlgView', {
        title: moduleName + '查看',
        iconCls: 'icon-edit',
        onOpen: function () {
            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetCarrentalOrderById',
                data: "{pOrderId:'" + itemid + "'}",
                success: function (data) {
                    initTemplate("viewTable", data, "viewContent");
                }
            });
        },
        onClose: function () {
            $("#viewContent").html("");
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
        url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/DeleteCarrentalOrdersById',
        data: "{pOrderIds:'" + str + "'}",
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

function search(value, customerObject) {
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var carrentalOrderData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort
            };
            var obj = SearchParam(tabNum,customerObject);
            carrentalOrderData = $.extend(carrentalOrderData, obj);
            carrentalOrderData.carOrderBo.OrderNum = value;

            var paramStr = JSON.stringify(carrentalOrderData);

            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetCarrentalOrders',
                data: paramStr,
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });
        } //loader
    };

    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);
    setSearchVal(tabNum,customerObject);
}
//根据tab的index值获取相应的搜索条件
function SearchParam(num,customerObject) {
    switch (num) {
        case 1:
            return { carOrderBo: { PaymentState: 0,UserName:customerObject.Name} };
        case 2:
            return { carOrderBo: { PaymentState: 1, UserName: customerObject.Name} };
        case 3:
            return { carOrderBo: { TicketState: 0, UserName: customerObject.Name} };
        case 4:
            return { carOrderBo: { TicketState: 1, UserName: customerObject.Name} };
        case 5:
            return { carOrderBo: { OrderState: 1, UserName: customerObject.Name} };
        default:
            return { carOrderBo: { UserName: customerObject.Name} };
    }
}
//tab标签点击效果
function tabsCheck(num, customerObject) {
    setSearchVal(num,customerObject);
    tabNum = num;
    var col = 0;
    //if (num == 5) col = 1;
    var dataGridOptions = {
        columns: [colum[col]],
        loader: function (param, success, error) {
            var carOrderData = { order: param.order, page: param.page, rows: param.rows, sort: param.sort };
            var obj = SearchParam(num,customerObject);//获取搜索条件
            carOrderData = $.extend(carOrderData, obj);
            var paramStr = JSON.stringify(carOrderData);

            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetCarrentalOrders',
                data: paramStr,
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });
            updateTabCount(customerObject);
        }
    };
    if (num == 0) {
        var m = {
            singleSelect: false,
            toolbar: '#toolbar',
            sortName: 'OrderId',
            sortOrder: 'desc',
            rownumbers: true,
            pagination: true,
            onDblClickRow: function (rowIndex, rowData) {
                fillForm(rowData.OrderId);
            }
        };
        $.extend(dataGridOptions, m);
    }

    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);
}

//执行退票
function cancelData() {
    if (!formValidate('cancelForm')) return;

    var items = getCheckedRows("dg");
    var ids = [];
    for (var i = 0; i < items.length; i++) {
        ids.push(items[i]['OrderId']);
    }

    var formUrl = '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/RefundCarrentalOrder';

    var form2JsonObj = form2Json("cancelForm");
    var form2JsonStr = { pOrderId: ids, carOrderBo: form2JsonObj };
    var jsonDataStr = JSON.stringify(form2JsonStr);

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            if (data == true) {
                msgShow('提示', '退单成功', 'info');
                resetFormAndClearValidate('cancelForm');
                closeCancelDialog();
                refreshTable('dg');
            } else {
                msgShow('提示', '退单失败', 'info');
            }
        }
    });
}

//包车订单改签
function editCarrentalOrder() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '退单', '请选择要改签的订单', '');
        //已经退票，已经核票，
    } else if (row.OrderState == 1 || row.TicketState == 1) {
        msgShow(moduleName + '退单', '该订单无法改签', '');
    }
    else if (row.IsOutTicket == 1) {
        //禁用掉edit form的所有input，只允许编辑textarea的备注
        resetFormAndClearValidate('ffedit');
        fillMealForm(row.OrderId);
        //已经出票
        //    $('#dlgEdit input').each(
        //            function (index, element) {
        //                $(this).prop('readonly',true)
        //            }
        //        )
        // msgShow(moduleName + '退单', '该订单已出票，改签失败', '');
    } else {
        resetFormAndClearValidate('ffedit');
        fillMealForm(row.OrderId);
    }
}

//包车订单中转
function transferOrder() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '退单', '请选择要中转的订单', '');
        //已经出票，已经核票，
    } 
    //else if (row.OrderState == 1) {
      //  msgShow(moduleName + '退单', '该订单无法中转', '');
   // } 
    else {
        resetFormAndClearValidate('ffTransfer');
        fillTransferForm(row.OrderId);
    }
}

//关闭弹出层
function closeFormDialog() {
    closeDialog('dlgView');
}

//关闭退订弹出层
function closeCancelDialog() {
    closeDialog('dlgCancel');
}

//关闭改签弹出层
function closeMealFormDialog() {
    closeDialog('dlgEdit');
}

//关闭中转弹出层
function closeTransferFormDialog() {
    closeDialog('dlgTransfer');
}

//修改tab后的数字
var title = ["全部", "未付款", "已付款", "未核票", "已核票", "已退票"];
function updateTabCount(customerObject) {
    var tempObject = { UserName: customerObject.Name, Phone: customerObject.Phone };
    var sendData = { carOrderBo: tempObject };
    ajaxCRUD({
        url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetAllCarrentalOrdersBySome',
        data:JSON.stringify(sendData),
        success: function (d) {
            $("#tabs li .tabs-title").each(function (i) {
                $(this).text(title[i] + "(" + d[i] + ")");
            });
        }
    });
}

//高级搜索
function openAdvancedSearch() {
    var eastPanel = $('.easyui-layout').layout('panel', 'east');

    if (eastPanel.length == 0) {
        var options = {
            region: 'east',
            split: true,
            width: 200,
            closable: true,
            title: '高级搜索',
            href: '/View/Carrental/CarrentalOrder/CarrentalOrderAdvancedSearch.htm',
            onClose: function () {
                $('.easyui-layout').layout('remove', 'east');
            },
            onLoad: function () {
                setTimeout(clearSearchCriteria, 0);
                getMachinesNo("ddlMachineNo", false);
                $(".easyui-combobox[id!=ddlMachineNo]").combobox('disableTextbox', { stoptype: 'readOnly', activeTextArrow: true, stopArrowFocus: true });
            }
        };

        $('.easyui-layout').layout('add', options);

        $('.layout-panel-east .panel-tool .layout-button-right').remove();

    } else {
        $('.easyui-layout').layout('remove', 'east');
    }
}

function advancedSearch() {
    var form2JsonObj = form2Json("advancedSearch");
    form2JsonObj.UserName = customerObject.Name;
    form2JsonObj.Phone = customerObject.Phone;
    tabNum = 0;
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var organizationData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                carOrderBo: form2JsonObj
            };
            var paramStr = JSON.stringify(organizationData);
            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetCarrentalOrders',
                data: paramStr,
                success: function (data) {
                    success(data);
                    $('#tabs li.tabs-selected').removeClass();
                    $('#tabs li:first').addClass("tabs-selected");
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });
        }
    };

    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);
    setSearchVal(6,customerObject);
}

function clearSearchCriteria() {
    clearForm('advancedSearch');
}


// 导出excel （add by jjx on 2013-12-25）
function exportExcel() {
    var datarows = $("#dg").datagrid("getRows").length;
    if (datarows <= 0) {
        $.messager.alert('包车订单—导出', '<center>没有要导出的数据</center>');
        return;
    }
    location.href = "/Export/WebService/ExportExcelWebService.asmx/ExportCarrentalOrder?data=" + $.cookie("searchData");
}
// 存储搜索的数据于cookie中
function setSearchVal(searchStatus,customerObject) {
    //    var fields = [{ f: "", v: 0 }, { f: "PaymentState", v: 0 }, { f: "PaymentState", v: 1 }, { f: "TicketState", v: 0 }, { f: "TicketState", v: 1 }, { f: "OrderState", v: 1}];
    var data = {};
    var orderNum = $("#txtOrderNum").val();
    switch (searchStatus) {
        case 0:
            data = { bo: { OrderNum: orderNum, UserName: customerObject.Name} };
            break;
        case 1:
            data = { bo: { PaymentState: 0, OrderNum: orderNum, UserName: customerObject.Name} };
            break;
        case 2:
            data = { bo: { PaymentState: 1, OrderNum: orderNum, UserName: customerObject.Name} };
            break;
        case 3:
            data = { bo: { TicketState: 0, OrderNum: orderNum, UserName: customerObject.Name} };
            break;
        case 4:
            data = { bo: { TicketState: 1, OrderNum: orderNum, UserName: customerObject.Name} };
            break;
        case 5:
            data = { bo: { OrderState: 1, OrderNum: orderNum, UserName: customerObject.Name} };
            break;
        case 6:
            var form2JsonObj = form2Json("advancedSearch");
            form2JsonObj.UserName = customerObject.Name;
            data = { bo: form2JsonObj };
            break;
        default:
            break;
    }
    return $.cookie("searchData", encodeURI(JSON.stringify(data)));
}

//获取JSON数据并填充到订单改签表单
function fillMealForm(itemid) {
    openDialog('dlgEdit', {
        title: moduleName + '改签',
        iconCls: 'icon-edit',
        onOpen: function () {
            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetCarrentalOrderById',
                data: "{pOrderId:'" + itemid + "'}",
                success: function (data) {
                    resetFormAndClearValidate('ffedit');
                    loadDataToForm('ffedit', data);
                    bindVal($('.val'), "id", data);
                }
            });
        }
    });
}

//一次性为多个标签绑定值
function bindVal(classObj, attr, dataVal) {
    // 获取所有的id名
    var idName = [];
    // 遍历所有的id名，存到数组idName中
    classObj.attr(attr, function (i, val) {
        idName.push(val);
    });
    // 遍历data数据，如果data的key值在idName中存在，就绑定相应的值
    for (var key in dataVal) {
        if ($.inArray(key, idName) > -1) {
            var val = dataVal[key];
            if (val == null) val = "";
            $('#' + key).text(val);
        }
    }
}

//保存改签表单数据
function saveMealData() {
    if (!formValidate('ffedit')) {
        return;
    }
    var formUrl = '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/MealCarrentalOrder';

    var form2JsonObj = form2Json("ffedit");
    form2JsonObj.IsRecompose = 1; //1为改签，其他否
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{carOrderBo:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            if (data == true) {
                msgShow('提示', "修改成功", 'info');
                closeMealFormDialog();
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });
}

//获取JSON数据并填充到订单中转表单
function fillTransferForm(itemid) {
    openDialog('dlgTransfer', {
        title: moduleName + '中转',
        iconCls: 'icon-edit',
        onOpen: function () {
            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/GetCarrentalOrderById',
                data: "{pOrderId:'" + itemid + "'}",
                success: function (data) {
                    initTemplate("transferTable", data, "transferContent");
                    $("input[name='TransferPrice']").numberbox({
                        min: 0,
                        max: 10000,
                        required: true
                    });
                    $("input[name='TransferStation']").validatebox({
                        required: true
                    });
                    $("#OrderIdtransfer").val(data.OrderId);
                    data.IsPaidHid = data.IsPaid;
                    loadDataToForm('fftransfer', data);
                    // $("#txtIsPaid").val(data.IsPaidHid);
                    //$("#txtIsTransfer").val(data.IsTransfer);
                    clearValidate('fftransfer');

                    //                    var id = $("input[name='Identification']").val();
                    //                    if (id == 0 || id == '0') {
                    //                        $("input[name='TransferCurrencyType'][value='HKD']").prop('checked', true);
                    //                    }
                }
            });
        },
        onClose: function () {
            $("#transferContent").html("");
        }
    });
}

//保存中转表单数据
function saveTransferData() {
    if (!formValidate('fftransfer')) {
        return;
    }
    var isCurCheck = $("input[name='TransferCurrencyType']:checked").length == 1;
    if (!isCurCheck) {
        msgShow('提示', '请选择中转结算币种', 'info');
        return;
    }
    var formUrl = '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/TransferCarrentalOrder';
    var id = $("#IsPaid").val();
    var istransfer = $("#txtIsTransfer").val();
    var form2JsonObj = form2Json("fftransfer");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{carOrderBo:" + form2JsonStr + "}";

    //添加中转记录
    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            if (data == true) {
                msgShow('提示', "提交成功", 'info');
                closeTransferFormDialog();
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });
}


function returnMoney() {
    var form2JsonObj1 = form2Json("fftransfer");
    var form2JsonStr1 = JSON.stringify(form2JsonObj1);
    var jsonDataStr1 = "{carOrderBo:" + form2JsonStr1 + "}";
    //中转记录收款。修改回款状态
    ajaxCRUD({
        url: '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/PayCarrentalTransferOrder',
        data: jsonDataStr1,
        success: function (data) {
            if (data == 0) {
                msgShow('提示', '提交成功', 'info');
                closeTransferFormDialog();
                refreshTable('dg');
            }
            else if (data == 1) {
                msgShow('提示', '该包车订单已回款', 'info');
                closeTransferFormDialog();
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });
}
//获取url中的某个参数的值
function GetUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");
    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;
        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");
            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    }
    else {
        return "";
    }
}