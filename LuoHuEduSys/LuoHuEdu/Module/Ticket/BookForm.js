var referenceModules = $.merge(['jqCookie'], easyloader.defaultReferenceModules);
using(referenceModules, function () {

    var today = new Date();
    $("#txtDate").datebox();
    $("#txtDate").datebox("setValue", today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());

    // 列表参数设置
    var dataGridOptions = {
        columns: [[
            { field: 'LineName', title: '线路名称', width: 140 },
            { field: 'CanBeSold', title: '可售数', width: 50 },
            { field: 'VehicleModelName', title: '车型', width: 80 },
            { field: 'StrStrateDate', title: '班次日期', width: 70 },
            { field: 'BanCiTime', title: '班次时间', width: 70 },
            { field: 'GuestPriceRMB', title: '直客单程价(RMB)', width: 100 },
            { field: 'GuestPriceHKD', title: '直客单程价(HKD)', width: 100 },
            { field: 'GuestBackForthPriceRMB', title: '直客往返价(RMB)', width: 100 },
            { field: 'GuestBackForthPriceHKD', title: '直客往返价(HKD)', width: 100 }
        ]],
        singleSelect: true,
        toolbar: '#toolbar',
        sortName: 'StrateDate,BanCiTime',
        sortOrder: 'asc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var date = $("#txtDate").datebox("getValue");
            var searchData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                banCiBo: {
                    BanCiState: 0,
                    StrateDate: date,
                    EndDate: date
                }
            };
            var paramStr = JSON.stringify(searchData);
            ajaxCRUD({
                url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetBancis',
                data: paramStr,
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });
        },
        onCheck: function (rowIndex, rowData) {
            //            parent.addTab("车票下单_" + rowData.TlId, "/View/ticket/ticketbook/bookForm.htm", "", "车票预订");
        }
    };

    getRoutes('ddlLine', true);

    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);
});

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
                banCiBo: {
                    BanCiState: 0,
                    TlId: $("#ddlLine").combobox('getValue'),
                    StrateDate: $("#txtDate").datebox("getValue")
                }
            };

            var paramStr = JSON.stringify(offPointAreaData);
            ajaxCRUD({
                url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetBancis',
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
            var ticketData = {
                page: param.page,
                rows: param.rows,
                order: param.order,
                sort: param.sort,
                entity: form2JsonObj
            };
            var paramStr = JSON.stringify(ticketData);

            ajaxCRUD({
                url: '/WebServices/TicketWebService/BookTicketWebService.asmx/GetBancis',
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



