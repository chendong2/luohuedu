//设置分机号码
$(function () {
    panel('extentionTemplate', {
        href: 'View/Customer/ExtentionForm.htm',
        onLoad: function () {}
    });
    panel('phoneTemplate', {
        href: 'View/Customer/PhoneForm.htm',
        onLoad: function () {
            $("#txtName1").validatebox({ required: true });
            $("#txtPhone1").validatebox({ required: true });
        }
    });
});
function setExtention() {
    openDialog('dlgExtention', {
                title: '设置分机号码',
                iconCls: 'icon-edit'
            });
}
function saveExtention() {
    if ($('#txtExtention').val() != '') {
        $('#extention').html("分机：" + $('#txtExtention').val());
        msgShow('提示', '分机号码设置成功', 'info');
        closeFormDialogExtention();
        var extentionVal=$('#txtExtention').val();//取得分机号
        var sendData = { pExtention: extentionVal };
        var jsonStr = JSON.stringify(sendData)
        setExtention1(jsonStr);
    } else {
        closeFormDialogExtention();
     }
}

var isPlayScreem = true;
function setExtention1(jsonStr) {
   setTimeout(execExtend(jsonStr), 1000*10);
    var formUrl = "/WebServices/CommonWebService/UserWebService.asmx/SetExtention";
    ajaxCRUD({
        url: formUrl,
        data: jsonStr,
        success: function (data) {
            if (data != 'null' && data != null && typeof (data) != 'undefined' && typeof (data.Msg) != 'undefined') {
                //408响应超时，503服务不可用,500服务异常
                //网关正常响应
                if (data.Code == 200) {
                    $('#lbtnCall').html("呼叫：" + data.Msg);
                    //成功响应，弹窗
                    $('#phone').val(data.Msg);
                    isPlayScreem = true;
                    {
                        //新电话打入
                        callNum(data.Msg);
                    }
                }
                else if (data.Code == 203) {
                    $('#lbtnCall').html("呼叫：(0)");
                    //$('#txtUserName1').val('');
                    //$('#txtPhone1').val('');
                }
            } else {
                //网关接口响应失败
                isPlayScreem = false;
                $('#phone').val("");
            }
        }
    });
}

//电话打进来，加载用户信息
function callNum(phone) {
   if (isPlayScreem) {
       fillFormPhone(phone);
       openDialog('dlgPhone', {
           title: '来电信息',
           iconCls: 'icon-edit',
           onLoad: function () {
               if (typeof (phone) != 'undefiend' && phone != '' && phone != null && phone != 'null') {
                   fillFormPhone(phone);
               }
           }
       });
   }
}

//获取JSON数据并填充到相应表单
function fillFormPhone(phone) {
    if (typeof (phone) == 'undefined' || phone == 0 || phone == '' || phone == null || phone == 'null') {
        return;
    }
    $("#txtPhone1").val(phone);
    ajaxCRUD({
        url: '/WebServices/CustomerWebService/CustomerWebService.asmx/GetCustomerByPhone',
        data: "{phone:'" + phone + "'}",
        success: function (data) {
            if (data==null||data.Name == null) {
                $("#txtName1").val("未知用户");
                $("#txtAddress").val("");
            } else {
                $("#txtName1").val(data.Name);
                $("#txtAddress").val(data.Address);
                $("#HidIdentification").val(data.Identification);
            }
            //JSON数据填充表单
        }
    });
}
//保存表单数据
function saveData() {
    if (!formValidate('ffPhone')) {
        return;
    }
    var hidValue = $("#HidIdentification").val();
    var basicUrl = '/WebServices/CustomerWebService/CustomerWebService.asmx/';

    var wsMethod = '';
    if (hidValue.length > 0) {
        wsMethod = "UpdateCustomer"; //修改
    } else {
        wsMethod = "AddCustomer"; //新增
    }

    var formUrl = basicUrl + wsMethod;

    var form2JsonObj = form2Json("ffPhone");
    var form2JsonStr = JSON.stringify(form2JsonObj);
    var jsonDataStr = "{customerInfoBo:" + form2JsonStr + "}";

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
                $('#phone1').val($('#phone').val());
                msgShow('提示', msg, 'info');
                closeFormDialogPhone();
                refreshTable('dg');
            } else {
                msgShow('提示', '提交失败', 'info');
            }
        }
    });
} // end saveData()
//关闭修改密码弹出层
function closeFormDialogExtention() {
    closeDialog('dlgExtention');
}
//关闭修改密码弹出层
function closeFormDialogPhone() {
    closeDialog('dlgPhone');
}
function ticket() {
    var customerName = $("#txtName1").val();
    var phone = $("#txtPhone1").val();
    var address = $("#txtAddress").val();
    var sendData = 
    {
        Name: customerName,
        Phone:phone,
        Address:address
    }
    setCookie("customerInfo", sendData);
    addTab("车票预订", '../View/Ticket/TicketBook/BanciList.htm', "icon");
}
function carrental() {
    var customerName = $("#txtName1").val();
    var phone = $("#txtPhone1").val(); 
    var address = $("#txtAddress").val();
    var sendData =
    {
        Name: customerName,
        Phone: phone,
        Address: address
    }
    setCookie("customerInfo", sendData);
    addTab("顾客包车订单", '../View/Carrental/CarrentalRoute/CarrentalRouteList.htm', "icon");
}

//写cookies 
function setCookie(key, value) {
    //写入cookie，必须指定路径为根目录
    $.cookie(key, encodeURI(JSON.stringify(value)), { path: '/' });
}

function execExtend(jsonStr) {
    return function () {
        setExtention1(jsonStr);    
    }
}
