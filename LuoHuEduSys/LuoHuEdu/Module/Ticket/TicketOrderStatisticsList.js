/***********************************
/* 创建人：wsl
/* 修改人：
/* 修改日期：2013-10-10
/* 包含列表的绑定,增删改查
/* 依赖：easyloader.js,easyui.config.js
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
var referenceModules = $.merge(['jqCookie'], easyloader.defaultReferenceModules);
using(referenceModules, function () {

    // 列表参数设置
    var dataGridOptions = {
        title: '车票订单量统计列表',
        columns: [[
            { field: 'LineName', title: '线路名称', width: 150 },
            { field: 'StationName', title: '站点名称', width: 150 },
            { field: 'OrderPrice', title: '票面金额', width: 140 },
            { field: 'PayPrice', title: '实际金额', width: 100 },
            { field: 'OrderCount', title: '下单量', width: 100 },
            { field: 'PaymentState', title: '付款状态', width: 80,
                formatter: function (value) {
                    switch (value) {
                        case '0': return '<font color="red">未付款</font>';
                        case '1': return '<font color="green">已付款</font>';
                        default: return "";
                    }
                } 
            },
            { field: 'CurrencyType', title: '币种', width: 80 },
            { field: 'IsAccount', title: '账号类型', width: 70 ,
                formatter: function (value) {
                    switch (value) {
                        case '1': return '挂账';
                        case '0': return '非挂账';
                        default: return "";
                    }
                } 
            }
        ]],
        singleSelect: false,
        toolbar: '#toolbar',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var searchData = {
                page: param.page, 
                rows: param.rows,
                ticketOrderStatisticBo: {}
            };
            var paramStr = JSON.stringify(searchData);
            ajaxCRUD({
                url: '/WebServices/TicketWebService/TicketOrderWebService.asmx/GetTicketOrderStatistics',
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
    //搜索状态
    setSearchVal(0);
    $(".search_middle a").removeClass("sure_btn");
});

var pTime = "";
function Search(time) {
    pTime = time;
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var offPointAreaData = {
                page: param.page,
                rows: param.rows,
                ticketOrderStatisticBo: {
                    StartDate: time
                }
            };

            var paramStr = JSON.stringify(offPointAreaData);
            ajaxCRUD({
                url: '/WebServices/TicketWebService/TicketOrderWebService.asmx/GetTicketOrderStatistics',
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
    setSearchVal(1);
    $(".search_middle a").removeClass("sure_btn");
    $("#" + time).addClass("sure_btn");
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
            href: '/View/Ticket/TicketStatistics/TicketOrderStatisticsAdvancedSearch.htm',
            onClose: function () {
                $('.easyui-layout').layout('remove', 'east');
            },
            onLoad: function () {
                setTimeout(clearSearchCriteria, 0);
                getRoutes("ddlLineAdvSearch", false);
                getStations("ddlStationAdv", false);
            }
        };

        $('.easyui-layout').layout('add', options);

        $('.layout-panel-east .panel-tool .layout-button-right').remove();

    } else {
        $('.easyui-layout').layout('remove', 'east');
    }
}

function advancedSearch() {
    if (ddlInfo("ddlLineAdvSearch", "线路名称")) {
        return;
    }
    if (ddlInfo("ddlStationAdv", "线路所属站点")) {
        return;
    }
    var form2JsonObj = form2Json("advancedSearch");

    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var ticketData = {
                page: param.page,
                rows: param.rows,
                ticketOrderStatisticBo: form2JsonObj
            };
            var paramStr = JSON.stringify(ticketData);

            ajaxCRUD({
                url: '/WebServices/TicketWebService/TicketOrderWebService.asmx/GetTicketOrderStatistics',
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

function clearSearchCriteria() {
    clearForm('advancedSearch');
}

// 导出excel （add by jjx on 2013-10-11）
function exportExcel() {
    var datarows = $("#dg").datagrid("getRows").length;
    if (datarows <= 0) {
        $.messager.alert('中港车票下单量列表—导出', '<center>没有要导出的数据</center>');
        return;
    }
    location.href = "/Export/WebService/ExportExcelWebService.asmx/ExportExcelByTicketOrderStatistics?data=" + $.cookie("searchData");

}
// 存储搜索的数据于cookie中
function setSearchVal(searchStatus) {
    var data = {};
    switch (searchStatus) {
        case 0:
            data = { bo: {} };
            break;
        case 1:
            data = { bo: { StartDate: pTime} };
            break;
        case 2:
            var form2JsonObj = form2Json("advancedSearch");
            data = {  bo: form2JsonObj };
            break;
        default:
            break;
    }
    return $.cookie("searchData",encodeURI(JSON.stringify(data)));
}


