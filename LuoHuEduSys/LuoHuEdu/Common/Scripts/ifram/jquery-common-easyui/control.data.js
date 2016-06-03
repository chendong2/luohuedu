/***********************************
/* 创建人：xwf
/* 修改日期：2013-5-17
/* 包含列表的绑定,增删改查
/* 依赖：easyloader.js,easyui.public.js
***********************************/

/***************************以下为填充模块中表单下拉框的条件的公用js方法 *******************************/
//说明，ddlid对应表单中下拉框的id，isSimpleSearchh为bool型参数，用于判断是普通表单条件填充(false)，还是简单搜索中的条件填充(true)
//区别是，普通表单的下拉框没有写入'请选择'选项,而简单搜索中填充的下拉框写入请选择选项
//注意:高级搜索中，所有写入'请选择'选项的value值都为0，会与数据库中定义的标识码冲突，标识码定义不得为0
//取消向高级搜索写入'请选择'候选项
//在表单中，非必填下拉统一写入请选择选项-by ys on 2013-7-18

//填充机器号列表条件
//value为机器id，文本为机器号
//add by ys on 2013-5-23
function getMachines(ddlid, isSimpleSearch) {
    var webserviceUrl = 'WebServices/AdminWebService/MachineWebService/MachineWebService.asmx/GetAllMachineNos';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ 'Identification': 0, 'No': '请选择' });
            }
            initCombobox(ddlid, "Identification", "No", data, true);
        }
    });
}

//填充机器号列表条件
//value和文本都为机器号
//add by wyq on 2013-5-23
function getMachinesNo(ddlid, isSimpleSearch) {
    var webserviceUrl = '/WebServices/CommonWebService/MachineWebService.asmx/GetAllMachineNos';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ 'No': '请选择' });
            }
            initCombobox(ddlid, "No", "No", data);
        }
    });
}


//填充线路填充下拉框
//value为线路id，文本为线路名称
//add by ys on 2013-5-24
function getRoutes(ddlRoute, isSimpleSearch) {
    var webserviceUrl = '/WebServices/CommonWebService/TicketRouteWebService.asmx/GetAllTicketRoutes';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                // 如果是搜索条件用的dll，那么加入请选择选项
                data.unshift({ 'TlId': 0, 'LineName': '请选择' });
            }
            initCombobox(ddlRoute, "TlId", "LineName", data, true);
        }
    });
}

//获代理商，填充为下拉框
//value为会员id，文本为会员名
//add by ys on 2013-5-31
function getVipUsers(ddlid, isSimpleSearch) {
    var webserviceUrl = 'WebServices/AdminWebService/MemberWebService/MemberWebService.asmx/GetVipUsersForDllFill';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            // debugger;
            if (isSimpleSearch) {
                data.unshift({ 'VipId': 0, 'UserName': '请选择' });
            }
            initCombobox(ddlid, "VipId", "UserName", data, true);
        }
    });
}

//从webservice返回返现类型,返现类型有返现和百分比两种类型
//1返现，2百分比，dll填充value写入代表码，文本写入名称
//add by ys on 2013-5-29 
function getPushTypes(ddlPushType, isSimpleSearch) {
    var webserviceUrl = '/WebServices/TicketWebService/StationRoyaltyWebService/StationRoyaltyWebService.asmx/GetPushTypes';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                //如果是搜索条件用的dll，那么加入请选择选项
                data.unshift({ 'Value': 0, 'Text': '请选择' });
            }
            initCombobox(ddlPushType, "Value", "Text", data);
        }
    });
}

//从webservice层返回禁用和启用状态来填充ddl
//1启用，2禁用，dll填充value写入代表码，文本写入名称
//add by ys on 2013-5-29 
function getStates(ddlStateType, isSimpleSearch) {
    var webserviceUrl = '/WebServices/TicketWebService/StationRoyaltyWebService/StationRoyaltyWebService.asmx/GetStates';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                //   如果是搜索条件用的dll，那么加入请选择选项
                data.unshift({ 'Value': 0, 'Text': '请选择' });
            }
            initCombobox(ddlStateType, "Value", "Text", data);
        }
    });
}

//填充站点下拉框条件
//add by ys on 2013-5-28
function getStations(ddlStaion, isSimpleSearch) {
    var webserviceUrl = '/WebServices/CommonWebService/StationWebService.asmx/GetAllStations';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ 'Identification': 0, 'Name': '请选择' });
            }
            initCombobox(ddlStaion, "Identification", "Name", data, true);
        }
    });
}
//填充公司站点下拉框条件
//add by 吴水丽 on 2013-8-7
function getLocalStations(ddlStaion, isSimpleSearch) {
    var webserviceUrl = 'WebServices/AdminWebService/StationWebService/StationWebService.asmx/GetAllLocalStations';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ 'Identification': 0, 'Name': '请选择' });
            }
            initCombobox(ddlStaion, "Identification", "Name", data, true);
        }
    });
}

//填充包车线路下拉框条件
//add by ys on 2013-6-14
function getCarrentalLines(ddlLine, isSimpleSearch) {
    var webserviceUrl = 'WebServices/CarrentalWebService/CarrentalRouteWebService/CarrentalRouteWebService.asmx/GetAllCarrentalRoutes';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ 'CriId': 0, 'LineName': '请选择' });
            }
            initCombobox(ddlLine, 'CriId', 'LineName', data, true);
        }
    });
}

//带有loading的表单填充，保证所有下拉框都已经填充完毕
//add by ys on 2013-6-20
//编辑表单的情况下，表单下拉条件都准备完毕后，
//jsondata是从ws返回的表单数据，formid是要填充的表单的id
function loadDataToFormPage(formid, jsondata) {
    $('#divLoading').hide();
    $('#tableForm').show();
    resetFormAndClearValidate(formid);
    //JSON数据填充表单
    loadDataToForm(formid, jsondata);
}

//js中对现有对象进行克隆
//本处代码不可删除！
//add by ys on 2013-7-18
//modified by ys on 2013-7-23,将clone递归复制改为使用push进行对象复制
function clone(myObj) {
    if (typeof (myObj) != 'object') return myObj;
    if (myObj == null) return myObj;
    var myNewObj = new Array();
    for (var i in myObj)
        myNewObj.push(myObj[i]);
    return myNewObj;
}
//下拉框允许手动输入，但是要和下拉列表匹配by 吴水丽 on 2013-9-17
function ddlInfo(ddlName, info) {
    var text = $("#" + ddlName).combobox('getText');
    var value = $("#" + ddlName).combobox('getValue');
    if (text != "" && text != "请选择" && value == text) {
        msgShow('提示', "请输入或选择正确的" + info, 'info');
        $("#note").remove();
        $('#submit').show();
        return true;
    }
    return false;
}


//填充车辆下拉框条件
//add by wyq on 2013-12-3
function getCars(ddlCar, isSimpleSearch) {
    var webserviceUrl = 'WebServices/AdminWebService/CarWebService/CarWebService.asmx/GetAllCars';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ 'Identification': 0, text: '请选择' });
            }
            initCombobox(ddlCar, 'Identification', text, data, true);
        }
    });
}

//填充联动车辆下拉框条件
//add by wyq on 2013-12-3
function getUnionCars(ddlCar, ddlHkCar, isSimpleSearch) {
    var webserviceUrl = 'WebServices/AdminWebService/CarWebService/CarWebService.asmx/GetAllCars';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        success: function (data) {
            if (isSimpleSearch) {
                data.unshift({ 'Identification': 0, 'HKCarNo': '请选择', 'No': '请选择' });
            }
            initCombobox(ddlCar, 'Identification', 'No', data, true);
            initCombobox(ddlHkCar, 'Identification', 'HKCarNo', data, true);
        }
    });
}

function getPurchaseProjects(ddlPro, isSimpleSearch) {
    var webserviceUrl = 'WebServices/PurchaseWebService/PurchaseProjectWebService/PurchaseProjectWebService.asmx/GetAllProject';
    ajaxCRUD({
        async: false,
        url: webserviceUrl,
        data: '{}',
        success: function (data) {
            if (isSimpleSearch) {
                // 如果是搜索条件用的dll，那么加入请选择选项
                data.unshift({ 'ProjectId': 0, 'ProjectName': '请选择' });
            }
            initCombobox(ddlPro, "ProjectId", "ProjectName", data, true);
        }
    });
}