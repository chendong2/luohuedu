//var name = '';

var referenceModules = $.merge(['citylist', 'jqsuggest', 'jqsuggestpublic', 'jqCookie'], easyloader.defaultReferenceModules);
var customerObject = { Name: '', Phone: '' }; //存放呼入用户检索条件的全局变量
using(referenceModules, function () {
    var customerInfo = $.cookie('customerInfo');
    var decodeInfo = {};
    if (customerInfo != '' && typeof (customerInfo) != 'undefined' && customerInfo != null && customerInfo != 'null') {
        decodeInfo = decodeURI(customerInfo);
        customerObject = JSON.parse(decodeInfo);
        $.cookie('customerInfo', null, { path: '/' }); //删除cookie，避免非呼入用户进入列表添加上条件
    } //解析成对象

    // 列表参数设置
    var dataGridOptions = {
        columns: [[
            { field: 'Id', checkbox: true },
            { field: 'CourseName', title: '课程名称', width: 150 },
            { field: 'TheYear', title: '年度', width: 150 },
            { field: 'TrainType', title: '培训类型', width: 140 },

            { field: 'Subject', title: '培训科目', width: 80 },
            { field: 'Phone', title: '联系电话', width: 80 },
            { field: 'Period', title: '学时', width: 80 },
            { field: 'Cost', title: '培训费用', width: 80 },
//            { field: 'ChargeObj', title: '收费对象', width: 50 },
            {field: 'SetCheck', title: '考勤设定', width: 50 },
            { field: 'IsMust', title: '种类', width: 60, formatter: function (value) {
                if (value == 1)
                    return '<span>选修</span>';
                else
                    return '<font>必修</font>';
            }
            },

            { field: 'Address', title: '培训地址', width: 70, sortable: true },
            { field: 'MaxNumber', title: '额定人数', width: 60, sortable: true },
            { field: 'SetApply', title: '超出额定人数设定', width: 80 },
            { field: 'OrganizationalName', title: '组织单位名称', width: 80 },
            { field: 'CourseDate', title: '培训日期', width: 50 },
            { field: 'TimeStart', title: '培训时间', width: 50 },
            { field: 'CourseCode', title: '课程代码', width: 50 }
      
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        sortName: 'CreatedOn',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var searchData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                entity: { PayAccount: $.cookie('UserName') }
            };
            //处理呼叫中心条件
            var isCanNameAdd = typeof (customerObject) != 'undefined' && typeof (customerObject.Name) != 'undefined'
            && customerObject.Name != null && customerObject.Name != '' && customerObject.Name != 'null';
            var isCanPhoneAdd = typeof (customerObject) != 'undefined' && typeof (customerObject.Phone) != 'undefined'
            && customerObject.Phone != null && customerObject.Phone != '';
            if (isCanNameAdd) {
                searchData.entity.CustomerName = customerObject.Name;
            }
            if (isCanPhoneAdd) {
                searchData.entity.Phone = customerObject.Phone;
            }
            var paramStr = JSON.stringify(searchData);
            ajaxCRUD({
                url: '/WebServices/TicketWebService/TicketListWebService.asmx/GetTicketList',
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
            fillForm(rowData.TkId);
        }
                ,
        onCheck: function (rowIndex, rowData) {
            if (rowData.IsRefund == 2) {
                msgShow('提示', "该车票已退订，无法继续操作。", 'info');
                $("#dg").datagrid("uncheckRow", rowIndex);
            }
            else if (rowData.AuditState == 2) {
                msgShow('提示', "该车票已核票，无法继续操作。", 'info');
                $("#dg").datagrid("uncheckRow", rowIndex);
            }
            else if (rowData.IsOutStr == "已出票") {
                msgShow('提示', "该车票已出票，无法继续操作。", 'info');
                $("#dg").datagrid("uncheckRow", rowIndex);
            }
        }
    };
    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);

    var dateStrE = getNowFormatDate();
    var datestart = new Date(Date.parse(dateStrE) - (86400000 * 1)); //前一天
    var dateStrS = getNowFormatDate(datestart);
    $("#txtCreatedOnSS").datebox();
    $("#txtCreatedOnES").datebox();
    $("#txtCreatedOnSS").datebox('setValue', dateStrS);
    $("#txtCreatedOnES").datebox('setValue', dateStrE);
    //搜索状态
    setSearchVal(0, customerObject);
});

//easyloader.defaultTime为700ms
setTimeout(loadPartialHtml, easyloader.defaultTime);

function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: '/View/Ticket/TicketList/TicketForm.htm',
            onLoad: function () {
                //添加验证
            }
        });
        panel('cancelTemplate', {
            href: '/View/Ticket/TicketList/TicketCancelForm.htm',
            onLoad: function () {
                //添加验证
            }
        });
    }
}

var moduleName = '中港车票列表-';
//点击“编辑”按钮
function editData() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(moduleName + '编辑', '请选择要编辑的一行数据', '');
    } else {
        resetFormAndClearValidate('ff');
        fillForm(row.TkId);
    }
}

var index = 0;
//获取JSON数据并填充到相应表单
function fillForm(hpId) {
    ajaxCRUD({
        url: '/WebServices/TicketWebService/TicketListWebService.asmx/GetOrderTicketById',
        data: "{id:'" + hpId + "'}",
        success: function (data) {
            initTemplate("order-template", data, "TicketForm");
            //打开对话框
            openDialog('dlg', {
                title: moduleName + '编辑',
                iconCls: 'icon-edit'
            });
            $("#BanCiTime a").live("click", function (e) {
                Deleteitemcss('BanCiTime');
                $(this).addClass("a_selected");
                $("#StrLinebanciId").val($(this).attr("id"));
                $("#StrLinebanci").val($(this).text());
            });
            $("#LeaveDate").datebox({ onSelect: function () {
                pickedFunc(); index = 1;
            }
            });
            //JSON数据填充表单
            loadDataToForm('ff', data);
            $("#HidSeatNum").val(data.SeatNum);
            $("#LeaveDate").datebox('setValue', data.LeaveDateStr);
            index = 0;
            pickedFunc();
        }
    });
}
function Deleteitemcss(id) {
    $.each($("#" + id + " a"), function (index) {
        if ($(this).hasClass("a_selected")) {
            $(this).removeClass("a_selected");
        }
    });
}
function pickedFunc() {
    $("#BanCiTime").html("正在加载...");
    $("#seat").html("");
    var ticketData = {
        tlId: $("#TlId").val(),
        date: $("#LeaveDate").datebox('getValue')
    };
    var paramStr = JSON.stringify(ticketData);
    ajaxCRUD({
        async: false,
        url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetAllBanCiByLineIdDate',
        data: paramStr,
        success: function (data) {
            var banCiTime = "";
            for (var i = 0; i < data.length; i++) {
                banCiTime += "<a class='a_link' id='" + data[i].BcId + "' rmb='" + data[i].PriceAdjustRMB + "' hkd='" + data[i].PriceAdjustHKD + "' onclick=\"getSeatByBanCi('" + data[i].BcId + "')\">" + data[i].BanCiTime + "</a>";
            }
            $("#LeaveDate").blur();
            $("#BanCiTime").html(banCiTime);
            if (data.length > 0) {
                if (index == 0) {
                    var n = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].BanCiTime == $("#StrLinebanci").val()) {
                            $("#StrLinebanciId").val(data[i].BcId);
                            $("#HidBanCiId").val(data[i].BcId);
                            $("#BanCiTime a:eq(" + i + ")").addClass("a_selected");
                            n = i;
                        }
                    }
                } else {
                    $("#BanCiTime a:first").addClass("a_selected");
                    $("#StrLinebanci").val(data[0].BanCiTime);
                    $("#StrLinebanciId").val(data[0].BcId);
                }

            } else {
                $("#BanCiTime").html('没有班次');
                $("#seat").html('没有座位');
            }
            if (index == 0)
                $("#BanCiTime a:eq(" + n + ")").click();
            else
                $("#BanCiTime a:eq(0)").click();

        },
        error: function () {
            $("#StrLinebanci").val("");
            $("#StrLinebanciId").val("");
            $("#StrSeat").val("");
            $("#seat").html("");
        }
    });
}
function OrderInit() {
    //默认第一个选择选中，并赋值
    $("#BanCiTime a:first").addClass("a_selected");
    $("#StrLinebanci").val($("#BanCiTime a:first").text());
    $("#BanCiTime").html($("#BanCiTime a:first").text() == "" ? '没有班次' : $("#BanCiTime").html());
    $("#seat").html('没有座位');
    getSeatByBanCi($("#BanCiTime a:first").attr("id"));
}

function getSeatByBanCi(banCiId) {
    if (banCiId == null) return;
    if ($("#StrLinebanciId").val() != banCiId) {
        $("#StrSeat").val("");
    }
    var seatData = { banciId: banCiId };
    var paramStr = JSON.stringify(seatData);
    ajaxCRUD({
        url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetSeatByBanci',
        data: paramStr,
        success: function (data) {
            var seat = "";
            for (var i = 0; i < parseInt(data[1]); i++) {
                seat += "<a class=\"a_link noclick\" id='seata" + (i + 1) + "'>" + (i + 1) + "</a>";
            }
            $("#seat").html(seat == "" ? '没有座位' : seat);
            if (data[0] != null) {
                var ableSeat = data[0].split(",");
                for (var i = 0; i < ableSeat.length; i++) {
                    $("#seata" + ableSeat[i]).addClass("enable");
                    $("#seata" + ableSeat[i]).removeClass("noclick");
                }
            }
            if ($("#HidBanCiId").val() == banCiId) {
                $("#seata" + $("#HidSeatNum").val()).addClass("enable");
                $("#seata" + $("#HidSeatNum").val()).removeClass("noclick");
                if ($("#StrSeat").val() != "")
                    index = 0;
            }
            if (index == 0) {
                $("#seata" + $("#HidSeatNum").val()).addClass("enable a_selected");
                $("#seata" + $("#HidSeatNum").val()).removeClass("noclick"); index = 1;
            } else
            { $("#seata" + $("#HidSeatNum").val()).removeClass(" a_selected"); $("#StrSeat").val(""); }
            var strSeat = '';
            $("#seat a").bind("click", function (e) {
                if ($(this).hasClass("enable")) {
                    if ($(this).hasClass("a_selected")) {
                        $(this).removeClass("a_selected");
                        strSeat = "";
                    }
                    else {
                        $("#seat a").removeClass("a_selected");
                        $(this).addClass("a_selected");
                        strSeat = $(this).text();
                    }
                    $("#StrSeat").val(strSeat);
                }
            });
        }
    });
}
//保存表单数据
function saveData() {
    if (!formValidate("ff")) return;
    if ($("#LeaveDate").datebox("getValue") == "")
    { msgShow(moduleName + '改签', '请选择班次日期', ''); return false; }
    if ($("#StrLinebanci").val() == '' || $("#StrLinebanciId").val() == '') {
        msgShow(moduleName + '改签', '请选择班次时间', '');
        return false;
    }
    if ($("#StrSeat").val() == "")
    { msgShow(moduleName + '改签', '请选择座位', ''); return false; }
    var hidValue = $("#TicketId").val();
    var basicUrl = '/WebServices/TicketWebService/TicketListWebService.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateTicket"; //修改
    } else {
        return;
    }

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{pOrderTicket:" + form2JsonStr + "}";

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
                msgShow('提示', "操作失败", 'info');
            }
        }
    });
} // end saveData()
//批量核票前台提示
function checkTicket() {
    batchOperateItems('dg', '核票', checkDatasAjax);
}

//批量核票后台AJAX处理
function checkDatasAjax(str) {
    ajaxCRUD({
        url: '/WebServices/TicketWebService/TicketListWebService.asmx/CheckTickets',
        data: "{ids:'" + str + "'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '批量核票成功！', 'info');
                refreshTable('dg');
            } else {
                msgShow('提示', "批量核票失败！", 'info');
            }
        },
        error: function () {
            error.apply(this, arguments);
        }
    });
}

//批量修改出票状态前台提示
function outTicket() {
    batchOperateItems('dg', '出票', outDatasAjax);
}
//批量修改出票状态前台提示
function noOutTicket() {
    batchOperateItems('dg', '未出票', noOutDatasAjax);
}

//批量修改出票状态后台AJAX处理
function outDatasAjax(str) {
    ajaxCRUD({
        url: '/WebServices/TicketWebService/TicketListWebService.asmx/OutTickets',
        data: "{ids:'" + str + "',isOut:'2'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '批量出票成功！', 'info');
                refreshTable('dg');
            } else {
                msgShow('提示', "批量出票失败！", 'info');
            }
        },
        error: function () {
            error.apply(this, arguments);
        }
    });
}

//批量修改出票状态后台AJAX处理
function noOutDatasAjax(str) {
    ajaxCRUD({
        url: '/WebServices/TicketWebService/TicketListWebService.asmx/OutTickets',
        data: "{ids:'" + str + "',isOut:'1'}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '批量未出票成功！', 'info');
                refreshTable('dg');
            } else {
                msgShow('提示', "批量未出票失败！", 'info');
            }
        },
        error: function () {
            error.apply(this, arguments);
        }
    });
}
//关闭弹出层同时清空表单
function closeFormDialog() {
    closeDialog('dlg');
}

function Search() {
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var offPointAreaData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                entity: {
                    TicketNo: $("#txtTicketNo").val(),
                    OrderNum: $("#txtOrderNum").val(),
                    CreatedOnS: $("#txtCreatedOnSS").datebox('getValue'),
                    CreatedOnE: $("#txtCreatedOnES").datebox('getValue'),
                    PayAccount: $.cookie('UserName')
                }
            };
            var paramStr = JSON.stringify(offPointAreaData);
            ajaxCRUD({
                url: '/WebServices/TicketWebService/TicketListWebService.asmx/GetTicketList',
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
    setSearchVal(1, customerObject);
}

//高级搜索
function openAdvancedSearch() {
    var eastPanel = $('#layout').layout('panel', 'east');

    if (eastPanel.length == 0) {
        var options = {
            region: 'east',
            split: true,
            width: 200,
            closable: true,
            title: '高级搜索',
            href: '/View/Ticket/TicketList/TicketAdvancedSearch.htm',
            onClose: function () {
                $('#layout').layout('remove', 'east');
                $("#searchStatus").val(2);
            },
            onLoad: function () {
                setTimeout(clearSearchCriteria, 0);
                $(".easyui-combobox").combobox('disableTextbox', { stoptype: 'readOnly', activeTextArrow: true, stopArrowFocus: true });
                getLine();
                //以为加载城市三字码下拉条件
                suggest('BeginCity', {
                    attachObject: "#DivSuggest1",
                    onSelect: function () {
                        var val = $('#DivSuggest1 .ac_over').attr('rel');
                        $('#BeginCitySanCode').val(val);
                        getLine(val, $('#EndCitySanCode').val());
                    }
                });
                suggest('EndCity', {
                    attachObject: "#DivSuggest2",
                    onSelect: function () {
                        var val = $('#DivSuggest2 .ac_over').attr('rel');
                        $('#EndCitySanCode').val(val);
                        getLine($('#BeginCitySanCode').val(), val);
                    }
                });
            }
        };

        $('#layout').layout('add', options);

        $('.layout-panel-east .panel-tool .layout-button-right').remove();

    } else {
        $('#layout').layout('remove', 'east');
    }
}
function getLine(beginCitySanCode, endCitySanCode) {
    var searchData = {
        entity: {
            BeginCitySanCode: beginCitySanCode,
            EndCitySanCode: endCitySanCode,
            IsShortLine: 1,
            LineState: 0
        }
    };
    var paramStr = JSON.stringify(searchData);
    ajaxCRUD({
        url: '/WebServices/CommonWebService/TicketRouteWebService.asmx/GetTicketLineNameByCity',
        data: paramStr,
        success: function (data) {
            initCombobox("ddlLine", "TlId", "LineName", data, true);
        },
        error: function () {
            error.apply(this, arguments);
        }
    });
}
function advancedSearch() {
    if (ddlInfo("ddlLine", "线路名称")) {
        return;
    }
    var form2JsonObj = form2Json("advancedSearch");
    form2JsonObj.CustomerName = customerObject.Name;
    form2JsonObj.PayAccount = $.cookie('UserName');

    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var ticketData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                entity: form2JsonObj
            };
            var paramStr = JSON.stringify(ticketData);

            ajaxCRUD({
                url: '/WebServices/TicketWebService/TicketListWebService.asmx/GetTicketList',
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
    setSearchVal(2, customerObject);
}

function clearSearchCriteria() {
    clearForm('advancedSearch');
}

//弹出退票窗口
function refund() {
    var row = getCheckedRows('dg');
    if (row.length < 1) {
        msgShow(moduleName + '退票', '请选择要退订的一行数据', 'info');
    } else {
        var ids = [];
        var orderId = "";
        for (var i = 0; i < row.length; i++) {
            if (row[i]['IsRefund'] == 2) {
                msgShow(moduleName + '退票', '车票号为 ' + row[i]['TicketNo'] + ' 的车票已退票请重新选择。', 'info');
                return;
            }

            ids.push(row[i]['TkId']);
            if (i == 0) {
                orderId = row[i]['OrderNum'];
            } else {
                if (orderId != row[i]['OrderNum']) {
                    msgShow(moduleName + '退票', '请选择同一订单的车票进行退票', 'info');
                    return;
                }
            }
        }

        var ticketIds = ids.join(",");

        ajaxCRUD({
            url: '/WebServices/TicketWebService/TicketListWebService.asmx/GetCancelTicketsInfo',
            data: "{ticketIds:'" + ticketIds + "'}",
            success: function (data) {
                initTemplate("cancel-form-template", data, "CancleForm");
                $("#txtRefundLimit").numberbox({ min: 0, max: 100 });
                $("#txtRefundLimit").validatebox({ required: true });
                openDialog('dlgCancel', {
                    title: moduleName + '退票',
                    iconCls: 'icon-no'
                });
            }
        });
    }
}

//执行退票事件
function cancelData() {
    if (!formValidate("ff-cancel")) return;
    //异步执行
    cancelDataAjax();

    //关闭弹出层
    closeCancelDialog();
}

function cancelDataAjax() {
    var form2JsonObj = form2Json("ff-cancel");
    if (form2JsonObj.RefundLimit < 0) {
        form2JsonObj.RefundLimit = 0;
    }
    else if (form2JsonObj.RefundLimit > 100) {
        form2JsonObj.RefundLimit = 100;
    }
    var form2JsonStr = JSON.stringify(form2JsonObj);
    ajaxCRUD({
        url: '/WebServices/TicketWebService/TicketListWebService.asmx/RefundTickets',
        data: "{ticketInfo:" + form2JsonStr + "}",
        success: function (data) {
            if (data == true) {
                msgShow('提示', '退票成功', 'info');
                refreshTable('dg');
            } else {
                msgShow('提示', '退票失败', 'info');
            }
        }
    });
}

//关闭退订弹出层
function closeCancelDialog() {
    closeDialog('dlgCancel');
}

function refreshCancelPrice() {
    var form2JsonObj = form2Json("ff-cancel");
    form2JsonObj.RefundLimit = $("#txtRefundLimit").val();
    if (form2JsonObj.RefundLimit < 0) {
        form2JsonObj.RefundLimit = 0;
    }
    else if (form2JsonObj.RefundLimit > 100) {
        form2JsonObj.RefundLimit = 100;
    }
    var rmb = form2JsonObj.RmbPrice * form2JsonObj.RefundLimit / 100;
    var hkd = form2JsonObj.HkdPrice * form2JsonObj.RefundLimit / 100;
    $("#lbRmbPrice").text(rmb);
    $("#lbHkdPrice").text(hkd);
}


// 导出excel （add by jjx on 2013-08-31）
function exportExcelByTicket() {
    location.href = "/Export/WebService/ExportExcelWebService.asmx/ExportExcelByTicket?data=" + $.cookie("searchData");

}
// 存储搜索的数据于cookie中
function setSearchVal(searchStatus, customerObject) {
    var data = {};
    switch (searchStatus) {
        case 0:
            // data = { order: "desc", sort: "TlId", bo: { CustomerName:customerObject.Name} };
            var dateS = $("#txtCreatedOnSS").datebox('getValue');
            var dateE = $("#txtCreatedOnES").datebox('getValue');
            data = { order: "desc", sort: "TlId", bo: { CreatedOnS: dateS, CreatedOnE: dateE} };
            break;
        case 1:
            var ticketNo = $("#txtTicketNo").val();
            var orderNum = $("#txtOrderNum").val();
            var dateS1 = $("#txtCreatedOnSS").datebox('getValue');
            var dateE1 = $("#txtCreatedOnES").datebox('getValue');
            //data = { order: "desc", sort: "TlId", bo: { TicketNo: ticketNo, OrderNum: orderNum} };
            data = {
                order: "desc",
                sort: "TlId",
                bo: {
                    TicketNo: ticketNo,
                    OrderNum: orderNum,
                    CreatedOnS: dateS1,
                    CreatedOnE: dateE1
                }
            };
            break;
        case 2:
            var form2JsonObj = form2Json("advancedSearch");
            form2JsonObj.CustomerName = customerObject.Name;
            data = { order: "desc", sort: "TlId", bo: form2JsonObj };
            break;
        default:
            break;
    }
    return $.cookie("searchData", encodeURI(JSON.stringify(data)));
}



var timeout = 500;
var closetimer = 0;
var ddmenuitem = 0;

// open hidden layer
function mopen(id) {
    // cancel close timer
    mcancelclosetime();

    // close old layer
    if (ddmenuitem) ddmenuitem.style.visibility = 'hidden';

    // get new layer and show it
    ddmenuitem = document.getElementById(id);
    ddmenuitem.style.visibility = 'visible';

}
// close showed layer
function mclose() {
    if (ddmenuitem) ddmenuitem.style.visibility = 'hidden';
}

// go close timer
function mclosetime() {
    closetimer = window.setTimeout(mclose, timeout);
}

// cancel close timer
function mcancelclosetime() {
    if (closetimer) {
        window.clearTimeout(closetimer);
        closetimer = null;
    }
}

// close layer when click-out
document.onclick = mclose;

function getNowFormatDate(date) {
    var day = new Date();
    if ((date != null) && (!(typeof date == 'undefined')))
    { day = date; }
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    Year = day.getFullYear(); //支持IE和火狐浏览器.
    Month = day.getMonth() + 1;
    Day = day.getDate();
    CurrentDate += Year;
    if (Month >= 10) {
        CurrentDate += "-" + Month;
    }
    else {
        CurrentDate += "-0" + Month;
    }
    if (Day >= 10) {
        CurrentDate += "-" + Day;
    }
    else {
        CurrentDate += "-0" + Day;
    }
    return CurrentDate;
} 