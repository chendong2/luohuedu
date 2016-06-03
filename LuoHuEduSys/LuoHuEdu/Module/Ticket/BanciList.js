
//新加城市选择插件
var referenceModules = $.merge(['citylist', 'jqsuggest', 'jqsuggestpublic', 'jqCookie'], easyloader.defaultReferenceModules);
var customerObject = { Name: '', Phone: '',Address:'' }; //存放呼入用户检索条件的全局变量
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
            { field: 'TlId', checkbox: true },
            { field: 'LineName', title: '线路名称', width: 140 },
            { field: 'VehicleModelText', title: '车型', width: 80 },
            { field: 'BeginCity', title: "出发城市", width: 60 },
            { field: 'EndCity', title: "目的城市", width: 60 },
            { field: 'GuestPriceRMB', title: '直客单程价(RMB)', width: 100 },
            { field: 'GuestPriceHKD', title: '直客单程价(HKD)', width: 100 },
            { field: 'GuestBackForthPriceRMB', title: '直客往返价(RMB)', width: 100 },
            { field: 'GuestBackForthPriceHKD', title: '直客往返价(HKD)', width: 100 }
        ]],
        singleSelect: true,
        toolbar: '#toolbar',
        sortName: 'TlId',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            //alert($.cookie('UserId'));
            var searchData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                ticketlineBo: {
                    IsShortLine: 1,
                    LineState: 0
                },
                userId: $.cookie('UserId')
            };
            var paramStr = JSON.stringify(searchData);
            ajaxCRUD({
                url: '/WebServices/CommonWebService/TicketRouteWebService.asmx/GetTicketRoutesTest',
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
            fillForm(rowData.TlId);
        }
    };

    getLine();
    //以为加载城市三字码下拉条件
    suggest('BeginCity', {
        attachObject: "#DivSuggest1",
        onSelect: function () {
            var val = $('#DivSuggest1 .ac_over').attr('rel');
            $('#go').val(val);
            getLine(val, $('#back').val());
        }
    });
    suggest('EndCity', {
        attachObject: "#DivSuggest2",
        onSelect: function () {
            var val = $('#DivSuggest2 .ac_over').attr('rel');
            $('#back').val(val);
            getLine($('#go').val(), val);
        }
    });
    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);
});
//easyloader.defaultTime为700ms
setTimeout(loadPartialHtml, easyloader.defaultTime);

function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: 'BookForm.htm',
            onLoad: function () {
                
            }
        });
    }
}
var flag = false;var isReturn = false;
var module = "车票";
//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    flag = false;
    isReturn = false;
    ajaxCRUD({
        url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetTicketlineById',
        data: "{lineId:'" + itemid + "'}",
        success: function (data) {
            //打开对话框
            openDialog('dlg', {
                title: module + '预定',
                iconCls: 'icon-add',
                onOpen: function () {
                }
            });
            $("#LineName").html(data.entity.LineName);
            $("#pricermb").html(data.entity.GuestPriceRMB);
            $("#pricehkd").html(data.entity.GuestPriceHKD);
            $("#ddReturn").hide(); $("#ddReturn1").hide();
            if (data.entity.IsBack == 0) { $("#isBack").html("不支持"); flag = false; }
            else {
                isReturn = true;
                $("#isBack").html("<input type=\"radio\" name=\"rbSingle\" checked=\"checked\" value=\"1\" /><label>单程</label>" +
                        "<input type=\"radio\" name=\"rbSingle\" value=\"2\" /><label>往返</label></span>");

                $('[name=rbSingle]').change(function () {
                    if ($('[name=rbSingle]:checked').val() == 1) {
                        $("#ddReturn").hide(); $("#ddReturn1").hide();
                        flag = false;
                        cal_price();
                        cal_total();
                    }
                    else {
                        $("#ddReturn").show(); $("#ddReturn1").show();
                        flag = true;
                        cal_price();
                        cal_total();
                    }
                });
            }
            data.entity.StrCurrencyType = "RMB";
            loadDataToForm('ff', data.entity);
            $("#Phone").val(customerObject.Phone);
            $("#CustomerName").val(customerObject.Name);
            $("#StrTicketonpoint").val(customerObject.Address);
            $('[name=StrCurrencyType]').change(function () {
                cal_total();
            });
            $("#BanCiTime a").live("click", function (e) {
                Deleteitemcss('BanCiTime');
                $(this).addClass("a_selected");
                $("#StrLinebanciId").val($(this).attr("id"));
                $("#StrLinebanci").val($(this).text());
                $("#PriceAdjustRMB").val($(this).attr("rmb"));
                $("#PriceAdjustHKD").val($(this).attr("hkd"));
                $("#BackPriceAdjustRMB").val($(this).attr("bkrmb"));
                $("#BackPriceAdjustHKD").val($(this).attr("bkhkd"));
                cal_price();
                cal_total();
            });

            var today = new Date();
            $("#StartDate").datebox({ onSelect: function () {
                pickedFunc();
            }
            });
            $("#StartDate").datebox("setValue", today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
            pickedFunc();
            if (isReturn) {
                $("#BanCiBackTime a").live("click", function (e) {
                    Deleteitemcss('BanCiBackTime');
                    $(this).addClass("a_selected");
                    $("#StrLinebanciBackId").val($(this).attr("id"));
                    $("#StrLinebanciBack").val($(this).text());
                    $("#SecondBackPriceAdjustRMB").val($(this).attr("bkrmb"));
                    $("#SecondBackPriceAdjustHKD").val($(this).attr("bkhkd"));
                    cal_price();
                    cal_total();
                });
                $("#EndDate").datebox({ onSelect: function () {
                    pickedBackFunc();
                }
                });
                $("#EndDate").datebox("setValue", today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
                pickedBackFunc();
            }
            OrderInit();
            //JSON数据填充表单
        }
    });
}
//点击“预定”按钮
function addTicketOrder() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(module + '编辑', '请选择要预定的一行数据', '');
    } else {
        resetFormAndClearValidate('ff');
        fillForm(row.TlId);
    }
}
function saveData() {
    if ($("#StartDate").datebox("getValue") == "")
    { msgShow(module + '预定', '请选择去程日期', ''); return false; }
    if ($("#StrLinebanci").val() == '' || $("#StrLinebanciId").val() == '') {
        msgShow(module + '预定', '请选择去程班次', '');
        return false;
    }
    if (flag) {
        if ($("#EndDate").datebox("getValue") == "")
        { msgShow(module + '预定', '请选择返程日期', ''); return false; }
        if ($("#StrLinebanciBack").val() == '' || $("#StrLinebanciBackId").val() == '') {
            msgShow(module + '预定', '请选择返程班次', '');
            return false;
        }
    }
    if ($("#StrSeat").val() == "")
    { msgShow(module + '预定', '请选择座位', ''); return false; }
    if (flag) {
        if ($("#Nun").val() != $("#hidBackNum").val())
        { msgShow(module + '预定', '去程和返程座位数必须相等', ''); return false; }

        if ($("#hidBackNum").val() == 0)
        { msgShow(module + '预定', '请选择返程座位', ''); return false; }
    }
   
    var hidValue = $("#TlId").val();
    var basicUrl = '/WebServices/TicketWebService/BookTicketWebService.asmx/';

    var wsMethod;
    if (hidValue.length > 0) {
        wsMethod = "TicketOrder"; //预定
    } else {
        wsMethod = ""; //
    }

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ff");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{ticketOrder:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            var msg = "预定成功"; 
            if (data == true) {
                msgShow('提示', msg, 'info');
                closeFormDialog();
                refreshTable('dg');
            } else { msgShow('提示', '提交失败', 'info'); }
        }
    });
} // end saveData()
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
                data.unshift({ 'TlId': 0, 'LineName': '请选择' });
                initCombobox("ddlLine", "TlId", "LineName", data, true);
            },
            error: function () {
                error.apply(this, arguments);
            }
        });
    }
    function Search() {
        if (ddlInfo("ddlLine", "线路名称")) {
            return;
        }
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var ticketlineData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                ticketlineBo: {
                    BeginCitySanCode: $("#go").val(),
                    EndCitySanCode: $("#back").val(),
                    TlId: $("#ddlLine").combobox('getValue'),
                    IsShortLine: 1,
                    LineState: 0,
                   VehicleModel:$("#ddlVehicleModel").combobox('getValue')
                },
               userId: $.cookie('UserId')
            };

            var paramStr = JSON.stringify(ticketlineData);
            ajaxCRUD({
                url: '/WebServices/CommonWebService/TicketRouteWebService.asmx/GetTicketRoutesTest',
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

function clearSearchCriteria() {
    clearForm('advancedSearch');
}
//关闭弹出层同时清空表单
function closeFormDialog() {
    closeDialog('dlg');
}



function OrderInit() {
    //默认第一个选择选中，并赋值
    $("#BanCiTime a:first").addClass("a_selected");
    $("#StrLinebanci").val($("#BanCiTime a:first").text());
    $("#BanCiTime").html($("#BanCiTime a:first").text() == "" ? '没有班次' : $("#BanCiTime").html()); 
    $("#seat").html('没有座位');
    getSeatByBanCi($("#BanCiTime a:first").attr("id"));
    if (isReturn) {
        $("#StrLinebanciId").val($("#BanCiTime a:first").attr("id"));
        $("#BanCiBackTime a:first").addClass("a_selected");
        $("#BanCiBackTime").html($("#BanCiBackTime a:first").text() == "" ? '没有返程班次' : $("#BanCiBackTime").html());
        $("#seatBack").html('没有座位');
        getSeatBackByBanCi($("#BanCiBackTime a:first").attr("id"));
        $("#StrLinebanciBack").val($("#BanCiBackTime a:first").text());
        $("#StrLinebanciBackId").val($("#BanCiBackTime a:first").attr("id"));
        
    }
     cal_price();
     cal_total();
   
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
    $("#Nun").val("1");
    $("#StrLinebanci").val("");
    $("#StrLinebanciId").val("");
    $("#StrSeat").val("");
    $("#seat").html("");
    var ticketData = {
        tlId: $("#TlId").val(),
        date: $("#StartDate").datebox('getValue')
    };
    var paramStr = JSON.stringify(ticketData);
    ajaxCRUD({
        async: false,
        url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetBanCiByLineIdDate',
        data: paramStr,
        success: function (data) {
            var banCiTime = "";
            for (var i = 0; i < data.length; i++) {
                banCiTime += "<a class='a_link' id='" + data[i].BcId + "' rmb='" + data[i].PriceAdjustRMB + "' hkd='" + data[i].PriceAdjustHKD + "' bkrmb='" + data[i].BackPriceAdjustRMB + "' bkhkd='" + data[i].BackPriceAdjustHKD + "' onclick=\"getSeatByBanCi('" + data[i].BcId + "')\">" + data[i].BanCiTime + "</a>";
            }
            $("#StartDate").blur();
            $("#BanCiTime").html(banCiTime);
            if (data.length > 0) {
                $("#BanCiTime a:first").addClass("a_selected");
                $("#StrLinebanci").val(data[0].BanCiTime);
                $("#StrLinebanciId").val(data[0].BcId);
                $("#PriceAdjustRMB").val(data[0].PriceAdjustRMB);
                $("#PriceAdjustHKD").val(data[0].PriceAdjustHKD);
                cal_price();
                cal_total();
            } else {
                $("#BanCiTime").html('没有班次');
                $("#seat").html('没有座位');
            }

            $("#BanCiTime a:first").click();
        },
        error: function () {
            $("#StrLinebanci").val("");
            $("#StrLinebanciId").val("");
            $("#StrSeat").val("");
            $("#seat").html("");
        }
    });
}

function pickedBackFunc() {
    if ($("#BackLineId").val() == null) return;
    $("#BanCiBackTime").html("正在加载...");
    $("#hidBackNum").val("0");
    $("#StrLinebanciBack").val("");
    $("#StrLinebanciBackId").val("");
    $("#StrSeatBack").val("");
    $("#seatBack").html("");
    var ticketData = {
        tlId: $("#BackLineId").val(),
        date: $("#EndDate").datebox('getValue')
    };
    var paramStr = JSON.stringify(ticketData);
    ajaxCRUD({
        url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetBanCiByLineIdDate',
        data: paramStr,
        success: function (data) {
            var banCiTime = "";
            for (var i = 0; i < data.length; i++) {
                banCiTime += "<a class='a_link' id='" + data[i].BcId + "' rmb='" + data[i].PriceAdjustRMB + "' hkd='" + data[i].PriceAdjustHKD + "' bkrmb='" + data[i].BackPriceAdjustRMB + "' bkhkd='" + data[i].BackPriceAdjustHKD + "' onclick=\"getSeatBackByBanCi('" + data[i].BcId + "')\">" + data[i].BanCiTime + "</a>";
            }
            $("#EndDate").blur();
            $("#BanCiBackTime").html(banCiTime);
            if (data.length > 0) {
                $("#BanCiBackTime a:first").addClass("a_selected");
                $("#StrLinebanciBack").val(data[0].BanCiTime);
                $("#StrLinebanciBackId").val(data[0].BcId);
                $("#BackPriceAdjustRMB").val(data[0].BackPriceAdjustRMB);
                $("#BackPriceAdjustHKD").val(data[0].BackPriceAdjustHKD);
                cal_price();
                cal_total();
            } else {
                $("#BanCiBackTime").html('没有班次');
                $("#seatBack").html('没有座位');
            }

            $("#BanCiBackTime a:first").click();
        },
        error: function () {
            $("#StrLinebanciBack").val("");
            $("#StrLinebanciBackId").val("");
            $("#StrSeatBack").val("");
            $("#seatBack").html("");
        }
    });
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
            $("#StrSeat").val("");
            $("#Nun").val(1);
            var strSeat = '';
            var num = 0;
            $("#seat a").bind("click", function (e) {
                if (strSeat != "")
                    strSeat = "," + strSeat;
                if ($(this).hasClass("enable")) {
                    if ($(this).hasClass("a_selected")) {
                        $(this).removeClass("a_selected");
                        var reg = new RegExp("," + $(this).text());
                        strSeat = strSeat.replace(reg, "");
                        num--;
                    }
                    else {
                        $(this).addClass("a_selected");
                        strSeat += "," + $(this).text();
                        num++;
                    }
                    var reg1 = new RegExp(",", "i");
                    strSeat = strSeat.replace(reg1, "");
                    $("#StrSeat").val(strSeat);
                    $("#Nun").val(num);
                    // cal_price($(this).attr("rmb"), $(this).attr("hkd"));
                    cal_total();
                }
            });
        }
    });
}
function getSeatBackByBanCi(banCiId) {
    if (banCiId == null) return;
    if ($("#StrLinebanciBackId").val() != banCiId) {
        $("#StrSeatBack").val("");
    }
    var paramStr = JSON.stringify({ banciId: banCiId });
    ajaxCRUD({
        url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetSeatByBanci',
        data: paramStr,
        success: function (data) {
            var seat = "";
            for (var i = 0; i < parseInt(data[1]); i++) {
                seat += "<a class=\"a_link  noclick\" id='seatBacka" + (i + 1) + "'>" + (i + 1) + "</a>";
            }
            $("#seatBack").html(seat == "" ? '没有座位' : seat);
            if (data[0] != null) {
                var ableSeat = data[0].split(",");
                for (var i = 0; i < ableSeat.length; i++) {
                    $("#seatBacka" + ableSeat[i]).addClass("enable");
                    $("#seatBacka" + ableSeat[i]).removeClass("noclick");
                }
            }
            $("#StrSeatBack").val("");
            $("#hidBackNum").val(0);
            var strSeat = '';
            var num = 0;
            $("#seatBack a").bind("click", function (e) {
                if (strSeat != "")
                    strSeat = "," + strSeat;
                if ($(this).hasClass("enable")) {
                    if ($(this).hasClass("a_selected")) {
                        $(this).removeClass("a_selected");
                        var reg = new RegExp("," + $(this).text());
                        strSeat = strSeat.replace(reg, "");
                        num--;
                    }
                    else {
                        if ($("#Nun").val() <= $("#hidBackNum").val()) {
                            msgShow(module + '预定', '返程座位超过了最大限制' + $("#Nun").val() + '位', ''); 
                        } else {
                            $(this).addClass("a_selected");
                            strSeat += "," + $(this).text();
                            num++;
                        }
                    }
                    var reg1 = new RegExp(",", "i");
                    strSeat = strSeat.replace(reg1, "");
                    $("#StrSeatBack").val(strSeat);
                    $("#hidBackNum").val(num);
                    //cal_price($(this).attr("rmb"), $(this).attr("hkd"));
                    //cal_total();
                }

            });
        }
    });
}
//计算单价
function cal_price() {
    var rmb = $("#PriceAdjustRMB").val();
    var hkd = $("#PriceAdjustHKD").val();
    if (flag) {
        var brmb = $("#BackPriceAdjustRMB").val();
        var bhkd = $("#BackPriceAdjustHKD").val();
        var secondbrmb = $("#SecondBackPriceAdjustRMB").val();
        var secondbhkd = $("#SecondBackPriceAdjustHKD").val();
        var pBackForthRmb = $("#GuestBackForthPriceRMB").val();
        var pBackForthHkd = $("#GuestBackForthPriceHKD").val();
        var pBackForthRmbBack = $("#BackGuestBackForthPriceRMB").val();
        var pBackForthHkdBack = $("#BackGuestBackForthPriceHKD").val();
        var c = parseFloat(brmb == "" ? "0" : brmb) + parseFloat(pBackForthRmb == "" ? "0" : pBackForthRmb);
        var d = parseFloat(bhkd == "" ? "0" : bhkd) + parseFloat(pBackForthHkd == "" ? "0" : pBackForthHkd);
        var e = parseFloat(secondbrmb == "" ? "0" : secondbrmb) + parseFloat(pBackForthRmbBack == "" ? "0" : pBackForthRmbBack);
        var f = parseFloat(secondbhkd == "" ? "0" : secondbhkd) + parseFloat(pBackForthHkdBack == "" ? "0" : pBackForthHkdBack);
        $("#pricermb").html(e + c);
        $("#pricehkd").html(f + d);
    }
    else {
        var pRmbG = $("#GuestPriceRMB").val();
        var pHkdG = $("#GuestPriceHKD").val();
        var a = parseFloat(rmb == "" ? "0" : rmb) + parseFloat(pRmbG== "" ? "0" :pRmbG);
        var b = parseFloat(hkd == "" ? "0" : hkd) + parseFloat(pHkdG == "" ? "0" : pHkdG);
        $("#pricermb").html(a);
        $("#pricehkd").html(b);
    }
}
//计算总价
function cal_total() {
    var currenty = $('[name=StrCurrencyType]:checked').val();
    var num = $("#Nun").val();
    var priceR = $("#pricermb").text();
    var priceH = $("#pricehkd").text();
    priceR = priceR == '' ? 0 : priceR;
    priceH = priceH == '' ? 0 : priceH;
    if (currenty != "RMB") {
        $("#totalcurrenty").html("HK$");
        $("#total").html(priceH * num);
    } else {
        $("#totalcurrenty").html("￥");
        $("#total").html(priceR * num);
    }
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