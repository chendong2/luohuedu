/***********************************
/* 创建人：yzb
/* 修改人：wsl
/* 修改日期：2013-6-7
/* 包含列表的绑定,增删改查
/* 依赖：easyloader.js,easyui.config.js
***********************************/
//easyloader.defaultReferenceModules表示默认引用easyui.public.js,如果当前IE7时会自动附加引用json2.min.js
//新加城市选择插件
var referenceModules = $.merge(['citylist', 'jqsuggest', 'jqsuggestpublic', 'jqCookie'], easyloader.defaultReferenceModules);
var customerObject = { Name: '', Phone: '', Address: '' }; //存放呼入用户检索条件的全局变量
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
        title: '培训管理列表',
        frozenColumns: [[
        { field: 'productid', title: '课程名称', width: 80 }
    ]],    
        columns: [[
            { field: 'CriId', checkbox: true },
             { field: 'StartCity', title: "课程名称", width: 120 },
            { field: 'EndCity', title: "设定", width: 60 },
            { field: 'StartArea', title: "审核", width: 100 },
            { field: 'EndArea', title: "锁定", width: 100 },
            { field: 'StationName', title: '报表', width: 80 },
            { field: 'Type', title: '培训类型', width: 60 },
            {field: 'GuestPriceRMB', title: "组织单位", width: 80 },
            { field: 'GuestPriceHKD', title: "上课时间", width: 80 },
            { field: 'VipPriceRMB', title: "课时", width: 80 },
            { field: 'VipPriceHKD', title: "额定人数", width: 80 },
            { field: 'AgentPriceRMB', title: "授课教师", width: 80 },
            { field: 'AgentPriceHKD', title: "授课教师单位", width: 80 },
            { field: 'IsHotStr', title: "等级", width: 55 },
            { field: 'IsHotStr', title: "上课地点", width: 55 },
            { field: 'IsHotStr', title: "科目类别", width: 55 },
            { field: 'IsHotStr', title: "授课对象", width: 55 },
            { field: 'IsHotStr', title: "种类", width: 55 },
            { field: 'IsHotStr', title: "课程代码", width: 55 }
        ]],
        singleSelect: true,
        toolbar: '#toolbar',
        sortName: 'CriId',
        sortOrder: 'desc',
        rownumbers: true,
        pagination: true,
        loader: function (param, success, error) {
            var routeData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                pCarrentalLineBo: { State: 0 }
            };
            var paramStr = JSON.stringify(routeData);

            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetCarrentalRoutes',
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
            fillForm(rowData.CriId);
        }
    };

    //初始化列表组件
    iniDataGrid('dg', dataGridOptions);
    //搜索状态
    //填充列表上的简单搜索条件
    getAllLineNamesWithNoIds('ddlCarrentalLine', true);
});

//easyloader.defaultTime为700ms
setTimeout(loadPartialHtml, easyloader.defaultTime);

function loadPartialHtml() {
    if ($('.window').length == 0) {
        panel('formTemplate', {
            href: '/View/Carrental/CarrentalRoute/CarrentalRouteView.htm',
            onLoad: function () {
                openDialog('dlg', {
                    title: module + '预定',
                    iconCls: 'icon-edit',
                    onOpen: function () {
                        //                        $('#formTabs').tabs('select', 0);
                    }
                }); closeFormDialog();
            }
        });
    }
}

//获取站点信息，填充下拉列表
function getAllStations(ddl) {
    ajaxCRUD({
        url: '/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetAllStations',
        async: false,
        success: function (data) {
            initCombobox(ddl, "Identification", "Name", data);
        }
    });
}
//获取车型信息，填充下拉列表
function getAllCarTypes(ddlCartypeId, isSimpleSearch) {
    ajaxCRUD({
        url: '/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetAllCarType',
        data: '',
        async: false,
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift(ddlCartypeId, { 'CartId': 0, 'Type': '请选择' });
            } else {
                initCombobox(ddlCartypeId, "CartId", "Type", data);
            }
        }
    });
}

function Search() {
    if (ddlInfo("ddlCarrentalLine", "线路名称")) return;
    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var carrentalRouteData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                pCarrentalLineBo: {
                    //取文本，按照线路名称来检索
                    LineName: $("#ddlCarrentalLine").combobox('getText'),
                    State: 0
                }
            };
            var paramStr = JSON.stringify(carrentalRouteData);
            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetCarrentalRoutes',
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

var module = "中港包车-";

//点击“预定”按钮
function addCarrentalOrder() {
    var row = getSelectedRow('dg');
    if (row == null) {
        msgShow(module + '预定', '请选择要预定的一条线路', '');
    } else {
        resetFormAndClearValidate('ff');
        fillForm(row.CriId);
    }
}


//获取JSON数据并填充到相应表单
function fillForm(itemid) {
    ajaxCRUD({
        url: '/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetOneCarrentalRouteForCallCenter',
        data: "{pCriId:'" + itemid + "'}",
        success: function (data) {
            if (data == null || typeof (data) == undefined) {
                msgShow('提示', '获取包车线路数据异常', 'info');
                return;
            }
            //打开对话框
            openDialog('dlg', {
                title: module + '预定',
                iconCls: 'icon-edit',
                onOpen: function () {
                    $('#formTabs').tabs('select', 0);
                }
            });
            //JSON数据填充表单
            var allSpans = $('.val');
            bindVal(allSpans, 'id', data);
            $("#CriId").val(data.CriId);
            $("#txtContactPhone").val(customerObject.Phone);
            $("#txtContactPerson").val(customerObject.Name);
            $("#txtOnPointName").val(customerObject.Address);
        }
    });
    //初始化下单参数
    $("#txtCarrentalDate").datebox({
        required: true
    });

    $("#txtCarrentalTime").timespinner({
        min: '00:00:00',
        required: true,
        showSeconds: false
    });
    $("#txtCarrentalTime").timespinner('setValue', '00:00');

    clearValidate('ff');
}

//保存表单数据
function saveData() {
    /*表单有未填项，返回*/
    if (!formValidate('ff')) {
        return;
    }

    var hidValue = $("#CriId").val();
    if (hidValue == '' || typeof (hidValue) == undefined || parseInt(hidValue) == 0) {
        msgShow('提示', "下单失败，请选择包车线路", 'info');
    }
    var formUrl = '/WebServices/CarrentalWebService/CarrentalOrderWebService.asmx/AddCarrentalOrder';
    var form2JsonObj = form2Json("ff");
    form2JsonObj.CriId = hidValue;
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{order:" + form2JsonStr + "}";

    ajaxCRUD({
        url: formUrl,
        data: jsonDataStr,
        success: function (data) {
            var msg = '';
            if (data == 0) {
                msg = "下单成功";
            }
            else {
                msg = '下单失败';
            }
            msgShow('提示', msg, 'info');
            closeFormDialog();
            //refreshTable('dg');
        }
    });
} // end saveData()

//高级搜索
function openAdvancedSearch() {
    var eastPanel = $('#layout').layout('panel', 'east');

    if (eastPanel.length == 0) {
        var options = {
            region: 'east',
            split: true,
            width: 190,
            closable: true,
            title: '高级搜索',
            href: '/View/TrainingManage/TrainingCourseManage/TrainingCourseAdvancedSearch.htm',
            onLoad: function () {
                initCombobox("ddlState", "State", "SateName");
                $("#ddlState").combobox('setValue', '0');
                getStations("ddlStationSearch", false);
                getAllCarTypes("ddlCartIdSearh", false);
            },
            onClose: function () {
                $('#layout').layout('remove', 'east');
            }
        };
        $('#layout').layout('add', options);
        $('.layout-panel-east .panel-tool .layout-button-right').remove();

    } else {
        $('#layout').layout('remove', 'east');
    }
}

function advancedSearch() {
    if (ddlInfo("ddlStationSearch", "所属站点")) return;
    var form2JsonObj = form2Json("advancedSearch");

    // 列表参数设置
    var dataGridOptions = {
        pageNumber: 1,
        loader: function (param, success, error) {
            var carrentalRouteData = {
                order: param.order,
                page: param.page,
                rows: param.rows,
                sort: param.sort,
                pCarrentalLineBo: form2JsonObj
            };
            var paramStr = JSON.stringify(carrentalRouteData);

            ajaxCRUD({
                url: '/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetCarrentalRoutes',
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


//关闭弹出层
function closeFormDialog() {
    closeDialog('dlg');
}
//禁用输入的combobox
function initComboboxRoute(param) {
    var width = param.width || 100;
    var panelHeight = param.panelHeight || 200;
    var data = param.data || null;

    param.obj.combobox({
        data: param.data, valueField: param.value, textField: param.text, width: width, panelHeight: panelHeight
    });
    if (param.disabled != 'undefined')
        param.obj.combobox('disableTextbox', { stoptype: 'readOnly', activeTextArrow: true, stopArrowFocus: true });
}

//获取已经有的包车线路集合，填充包车线路下拉框
//add by ys on 2013-7-18
function getCarentalLines(ddlid, isSimpleSearch) {
    var webserviceUrl = '/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetAllCarrentalRoutes';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                //写入默认的请选择选项
                data.unshift({ "CriId": 0, 'LineName': '请选择' });
            }
            initCombobox(ddlid, "CriId", "LineName", data, "");
        }
    });
}

//获取所有线路名称，填充包车线路下拉框
//add by ys on 2013-7-22
function getAllLineNamesWithNoIds(ddlid, isSimpleSearch) {
    var webserviceUrl = "/WebServices/CarrentalWebService/CarrentalRouteWebService.asmx/GetAllCarrentalLineNames";
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ "Index": 0, 'LineName': '请选择' });
            }
            initCombobox(ddlid, "Index", "LineName", data, true);
        }
    });
}

var searchStatus = 0;
// 导出excel （add by jjx on 2013-08-06）
function exportExcelByCarrentalline() {
    var data = {};
    switch (searchStatus) {
        case 0: // 页面初始化时
            data = { order: "desc", sort: "CriId", bo: {} };
            break;
        case 1: // 普通搜索时
            var lineName = $("#ddlCarrentalLine").combobox('getText');
            data = { order: "desc", sort: "CriId", bo: { LineName: lineName} };
            break;
        case 2: // 高级搜索时
            var form2JsonObj = form2Json("advancedSearch");
            data = { order: "desc", sort: "CriId", bo: form2JsonObj };
            break;
        default:
            break;
    }
    location.href = "Export/WebService/ExportExcelWebService.asmx/ExportExcelByCarrentalline?data=" + encodeURI(JSON.stringify(data));
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

function sure(obj) {
    if (!formValidate('ff')) {
        return;
    }
    $(obj).parent().prepend('<b id="note">提交中...</b>');
    $('#submit').hide();
    saveData();
    $('#submit').show();
    $('#note').remove();
}