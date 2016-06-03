/***********************************
/* 创建人：xwf
/* 修改人：wk,wyq
/* 修改日期：2013-5-10
/* 主要是框架页的一些常规js操作，如弹出层操作、信息提示,控制页面刷新
/* 依赖：jquery.js,easyui.js
***********************************/

//忽略点击响应判断
function ignoreElem(event) {
    if (event) {
        var el = event.srcElement || event.target;
        var type = el.type;
        if (type == 'checkbox') return true; //忽略有效
    }
    return false;
}

/********************************** 信息提示 **********************************/
//弹出信息窗口 title:标题 msgString:提示信息 msgType:信息类型 [error,info,question,warning]
function msgShow(title, msgString, msgType) {
    $.messager.alert(title, msgString, msgType);
}

//确定信息,改名避免与百度富文本冲突s
function msgConfirm(title, message, fun) {
    $.messager.confirm(title, message, function (isOk) {
        if (isOk) {
            fun();
        }
    });
}
//操作提示信息
function msgTip(msg) {
    setTimeout(function () { $(".datagrid-mask,.datagrid-mask-msg").remove(); }, 1000);
    $("<div class=\"datagrid-mask\" style=\"background:#DCDCDC\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
    $("<div class=\"datagrid-mask-msg\" style=\"border:1px;background:#FFF8DC\"></div>").html(msg).appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
};
/********************************** 打开对话框 ************************************/
//popContainer为页面div的id，popIframe为崁入div中的iframe的Id,event为事件对象预留做附加处理用
var _openObj; //打开对话框对象

//打开对话框
function openDialog(id, dialogOptions) {
    var settings = {
        closed: false, //用于打开对话框
        cache: true
    };

    settings = $.extend(settings, dialogOptions);
    $('#' + id).dialog(settings);
}

function openFullDialog(e, pUrl, pTitle, icon, fn) {
    $('#popIframe').attr('src', pUrl);
    _openObj = $('#popContainer').dialog({
        title: pTitle,
        width: getViewportWidth(),
        height: getViewportHeight(),
        iconCls: icon,
        closed: false,
        cache: false,
        draggable: false,
        resizable: true,
        modal: true
    });
}

function openFullWindow(pUrl, pTitle, icon, event) {
    if (ignoreElem(event)) return false; //选择框点击不弹出

    $('#popIframe').attr('src', pUrl);
    _openObj = $('#popContainer').window({
        title: pTitle,
        width: getViewportWidth(),
        height: getViewportHeight(),
        iconCls: icon,
        closed: false,
        cache: false,
        minimizable: false,
        maximizable: false,
        draggable: false,
        resizable: false,
        modal: true
    });

    return true;
}

//打开对话框
function popupDialog(dlgId) {
    $('#' + dlgId).dialog('open');
}

//关闭对话框
function closeDialog(dlgId) {
    $('#' + dlgId).dialog('close');
}

//关闭带有Iframe对话框
function closeIframeDialog() {
    if (top._openObj) {
        top._openObj.dialog('close');
        top._openObj = null;
        $('#popIframe').attr('src', 'about:blank');
    }
}

function getViewportHeight() {
    if (window.innerHeight != window.undefined)//FF
    {
        return window.innerHeight - 30;
    }

    if (document.compatMode == 'CSS1Compat')//IE
    {
        return document.documentElement.clientHeight - 30;
    }

    if (document.body)//other
    {
        return document.body.clientHeight - 30;
    }

    return 400;
}

function getViewportWidth() {

    if (window.innerWidth != window.undefined)//FF
    {
        return window.innerWidth - 30;
    }

    if (document.compatMode == 'CSS1Compat')//IE
    {
        return document.documentElement.clientWidth - 30;
    }

    if (document.body)//other
    {
        return document.body.clientWidth - 30;
    }

    return 640;
}

/****************************  页面刷新  ********************************/
//刷新页面
function refresh() {
    var url = window.location.href.split("#")[0];
    window.location.href = url;

}

function getUrlRefresh(url) {
    if (url.indexOf("?") > 0) {
        var reg = /&t=.+?(?=&|$)/;
        var m = url.match(reg);
        if (m) {
            return url.replace(reg, '&t=' + (new Date().getTime()));
        } else {
            return url + "&t=" + (new Date().getTime());
        }

    } else {
        return url + "?t=" + (new Date().getTime());
    }
}

/************************  增删改查通用的AJAX ******************************/
function ajaxCRUD(ajaxOptions) {
    var settings = {
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        dataFilter: function (data, type) {

            if (type == 'json' && typeof (data) == 'string') {
                data = jQuery.parseJSON(data);

                if (data.hasOwnProperty("d")) {
                    data = JSON.stringify(data.d);
                } else {
                    data = JSON.stringify(data);
                }
            }

            return data;
        }
    };

    settings = $.extend(settings, ajaxOptions);
    $.ajax(settings);
}

/************************  EasyUI列表组件DataGrid  ***************************/
//初始列表组件DataGrid
function iniDataGrid(tableId, dataGridOptions) {
    var settings = {
        pageSize: 20,
        pageList: [25, 50, 100, 200],
        fit: true,
        height: $("body").height() - 110,
        loadFilter: function (data) {
            if (data == null || data == undefined) {
                return{total:0,rows:0};//避免ws返回null导致js脚本异常 by ys on 2013-12-04
            }
            if (data.d) {
                return data.d;
            } else {
                return data;
            }
        },
        rowStyler: function (index, row) {
            if (index % 2 == 1) {
                $($(".datagrid-row")[index]).addClass("tr_evencolor");
            }
        }
    };

    settings = $.extend(settings, dataGridOptions);
    $('#' + tableId).datagrid(settings);

}

//获取单选的行
function getSelectedRow(tableId) {
    return $('#' + tableId).datagrid('getSelected');
}

//获取多选的行
function getCheckedRows(tableId) {
    return $('#' + tableId).datagrid('getChecked');
}

//获取列表的FileId
function getColumnIds(tableId, num) {
    return $('#' + tableId).datagrid('getColumnFields')[num];
}

//批量删除
function deleteItems(tableId, fn) {
    var items = getCheckedRows(tableId);
    if (items.length < 1) {
        $.messager.alert('删除', '当前没有选择删除项');
    }
    else {
        $.messager.confirm('批量删除', '确定要批量删除吗？', function (r) {
            if (r) {
                var ids = [];
                var ido = getColumnIds(tableId, 0);
                for (var i = 0; i < items.length; i++) {
                    ids.push(items[i][ido]);
                }
                //异步删除
                fn(ids.join(","));
            }
        });
    }
}
//操作的警示信息
function operateItems(tableId, operate, fn) {
    var items = getCheckedRows(tableId);
    if (items.length < 1) {
        $.messager.alert(operate, '当前没有选择' + operate + '项');
    }
    else {
        $.messager.confirm(operate, '确定要' + operate + '吗？', function (r) {
            if (r) {
                var ids = [];
                var ido = getColumnIds(tableId, 0);
                for (var i = 0; i < items.length; i++) {
                    ids.push(items[i][ido]);
                }

                //异步执行
                fn(ids.join(","));
            }
        });
    }
}

//批量操作的警示信息
function batchOperateItems(tableId, operate, fn) {
    var items = getCheckedRows(tableId);
    if (items.length < 1) {
        $.messager.alert(operate, '当前没有选择' + operate + '项');
    }
    else {
        $.messager.confirm('批量' + operate, '确定要批量' + operate + '吗？', function (r) {
            if (r) {
                var ids = [];
                var ido = getColumnIds(tableId, 0);
                for (var i = 0; i < items.length; i++) {
                    ids.push(items[i][ido]);
                }

                //异步删除
                fn(ids.join(","));
            }
        });
    }
}

//批量禁用，针对不能物理删除的记录做禁用处理
//add by ys on 2013-5-29
function disableItems(tableId, fn) {
    var items = getCheckedRows(tableId);
    if (items.length < 1) {
        $.messager.alert('禁用', '当前没有选择禁用项');
    }
    else {
        $.messager.confirm('批量禁用', '确定要批量禁用吗？', function (r) {
            if (r) {
                var ids = [];
                var ido = getColumnIds(tableId, 0);
                for (var i = 0; i < items.length; i++) {
                    ids.push(items[i][ido]);
                }

                //异步逻辑删除，采用禁用处理
                fn(ids.join(","));
            }
        });
    }
}

//批量禁用，针对不能物理删除的记录做禁用处理
//add by ys on 2013-12-13
function auditItems(tableId, fn) {
    var items = getCheckedRows(tableId);
    if (items.length < 1) {
        $.messager.alert('审核', '当前没有选择审核项');
    }
    else {
        $.messager.confirm('批量审核', '确定要批量审核吗？', function (r) {
            if (r) {
                var ids = [];
                var ido = getColumnIds(tableId, 0);
                for (var i = 0; i < items.length; i++) {
                    ids.push(items[i][ido]);
                }
                fn(ids.join(","));
            }
        });
    }
}

//批量启用，对已经禁用处理的数据批量启用
//add by ys on 2013-6-8
function enableItems(tableId, fn) {
    var items = getCheckedRows(tableId);
    if (items.length < 1) {
        $.messager.alert('启用', '当前没有选择启用项');
    }
    else {
        $.messager.confirm('批量启用', '确定要批量启用吗？', function (r) {
            if (r) {
                var ids = [];
                var ido = getColumnIds(tableId, 0);
                for (var i = 0; i < items.length; i++) {
                    ids.push(items[i][ido]);
                }

                //异步处理
                fn(ids.join(","));
            }
        });
    }
}

//刷新列表
function refreshTable(tableId) {
    $('#' + tableId).datagrid('reload');
    $('#submit').show();
    $("#note").remove();
}

//自动调整行高度
function fixDetailRowHeight(tableId, rowIndex) {
    $('#' + tableId).datagrid('fixDetailRowHeight', rowIndex);
}

//关闭行
function collapseRow(tableId, rowIndex) {
    $('#' + tableId).datagrid('collapseRow', rowIndex);
}

//将某行处于选中状态
function selectRow(tableId, rowIndex) {
    $('#' + tableId).datagrid('selectRow', rowIndex);
}

/***************************  EasyUI表单组件Form  ****************************/
//json数据填充表单
function loadDataToForm(formId, jsonData) {
    $('#' + formId).form('load', jsonData);
}

//清空表单
function clearForm(formId) {
    $('#' + formId).form('clear');
}

//重置表单
function resetForm(formId) {
    $('#' + formId).form('reset');
}

//重置表单并同时清除验证
function resetFormAndClearValidate(formId) {
    clearForm(formId);
    resetForm(formId);
    clearValidate(formId);
}

//表单序列化为JSON对象
function form2Json(formId) {
    var jsonObj = {};
    var formSerializeArr = $('#' + formId).serializeArray();

    $.each(formSerializeArr, function () {
        if (jsonObj[this.name]) {
            if (!jsonObj[this.name].push) {
                jsonObj[this.name] = [jsonObj[this.name]];
            }
            jsonObj[this.name].push(this.value || '');
        } else {
            jsonObj[this.name] = this.value || '';
        }
    });

    return jsonObj;
}

//返回表单验证状态，验证通过则true，反之为false
function formValidate(formId) {
    return $('#' + formId).form('validate');
}

/***************************  EasyUI搜索组件searchbox  ***********************/
function searchbox(searchboxId, searchboxOptions) {
    $('#' + searchboxId).searchbox(searchboxOptions);
}

/***************************  EasyUI面板组件panel  **************************/
function panel(panelId, panelOptions) {
    $('#' + panelId).panel(panelOptions);
}


//***************************  初始化EasyUI组件  ****************************/
//初始化dialog
function initDialog(dlgId) {
    $("#" + dlgId).dialog({
        onClose: function () {
        }
    });
}

//初始化tabs
function initTabs(tabId) {
    $("#" + tabId).tabs();
}

//初始化Linkbutton
function initLinkbutton(lbtnId) {
    $("." + lbtnId).linkbutton();
}

//初始化下拉框Combobox
//modified by ys on 2013-7-22
//添加布尔型参数isAutoFilter，是否支持手动输入并智能过滤
function initCombobox(comboId, valueField, textField, data, isAutoFilter) {
    var length;
    if (data == null) {
        length = $("#" + comboId).find("option").length;
    } else {
        length = data.length;
    }

    $('#' + comboId).combobox({
        valueField: valueField,
        textField: textField,
        panelHeight: length > 10 ? 200 : 'auto',
        data: data,
        onLoadSuccess: function () {
            //未填写此参数，那么默认禁用手动输入并且不支持智能过滤
            if (isAutoFilter == null || isAutoFilter == 'undefined') {
                $(this).combobox('disableTextbox', { stoptype: 'readOnly', activeTextArrow: true, stopArrowFocus: true });
                // $(this).combobox('disableTextbox', { activeTextArrow: true, stopArrowFocus: true });
            }
        }
    });
}
//初始化下拉框Combobox
function initComboxByUrl(comboId, val, txt, url, isSet) {
    if (isSet == null) isSet = true;
    ajaxCRUD({
        async: false,
        url: url,
        success: function (d) {
            initCombobox(comboId, val, txt, d);
            if (isSet && d != null && d.length > 0) {
                $("#" + comboId).combobox({ value: d[0][val] });
            }
        }
    });
}
//初始化下拉框Combobox,是否可以手动输入
function initComboxByUrl(comboId, val, txt, url, isSet, isAutoFilter) {
    if (isSet == null) isSet = true;
    ajaxCRUD({
        async: false,
        url: url,
        success: function (d) {
            initCombobox(comboId, val, txt, d, isAutoFilter);
            if (isSet && d != null && d.length > 0) {
                $("#" + comboId).combobox({ value: d[0][val] });
            }
        }
    });
}
//初始化validatebox
function initValidatebox(className) {
    $('.' + className).validatebox();
}

//设置具体表单的相关验证
function setValidatebox(id, validateboxOption) {
    $('#' + id).validatebox(validateboxOption);
}

/********************************** validatebox验证扩展 **********************************/

$.extend($.fn.validatebox.defaults.rules, {
    equalTo: {//判断两次输入的密码是否一致 by jjx
        validator: function (value, param) {
            return $('#' + param[0]).val() == value;
        },
        message: '两次输入密码不匹配'
    },
    mobile: {//手机号码验证,value值为文本框中的值 by jjx
        validator: function (value) {
            var reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
            return reg.test(value);
        },
        message: '输入手机号码格式不准确.'
    },
    ddlRequire: {// 下拉列框提交时排除选项“请选择”by jjx
        validator: function (value) {
            return value != "请选择";
        },
        message: '请选择'
    },
    phone: {//电话号码验证,value值为文本框中的值 by wsl
        validator: function (value) {
            var reg = /^[0-9]+$/;
            return reg.test(value);
        },
        message: '输入电话号码格式不准确.'
    },
    IdCard: {//身份证格式,value值为文本框中的值 by wsl
        validator: function (value) {
            var reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
            return reg.test(value);
        },
        message: '身份证格式不正确.'
    },
    numletter: {//字母数字格式,value值为文本框中的值 by wsl
        validator: function (value) {
            var reg = /^[A-Za-z0-9]+$/;
            return reg.test(value);
        },
        message: '只能输入字母数字.'
    },
    number: {//数字格式,value值为文本框中的值 by wsl
        validator: function (value) {
            var reg = /^[0-9]+$/;
            return reg.test(value);
        },
        message: '只能输入数字.'
    },
    notblank: {
        validator: function (value) {
            var reg = /\s+/;
            return reg.test(value) == false;
        },
        message: '不能有空格.'
    },
    maxLength: {
        validator: function (value, param) {
            return value.length <= param[0];
        },
        message: '最多只能输入{0}个字符'
    },
    minLength: {
        validator: function (value, param) {
            return value.length <= param[0];
        },
        message: '最少必须输入{0}个字符'
    },
    dateNeed: {//add by ys on 2013-6-3
        validator: function (value) {
            var reg = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
            return reg.test(value);
        },
        message: '对不起，不是日期格式'
    },
    afterToday: {
        validator: function (value) {
            var d1 = $.fn.datebox.defaults.parser(new Date().toDateString());
            var d2 = $.fn.datebox.defaults.parser(value);
            return d2 >= d1;
        },
        message: '请选择今天以后的日期'
    },
    email: {
        validator: function (value) {
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            return reg.test(value);
        },
        message: '对不起，不是邮件格式'
    },
    unique: {
        validator: function (value, param) {
            value = $.trim(value);
            var serviceUrl = param[0];
            var hiddenIdVal = $('#' + param[1]).val();
            var hiddenNameVal = $('#' + param[2]).val();
            hiddenNameVal = $.trim(hiddenNameVal);
            var paramName = param[3];
            var dataStr = '{' + paramName + ':"' + value + '"}';
            var result = false;
            if (hiddenIdVal.length > 0 && hiddenNameVal == value) {
                return true;
            }

            $.ajax({
                async: false,
                cache: false,
                url: serviceUrl,
                data: dataStr,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                dataFilter: function (data, type) {

                    if (type == 'json' && typeof (data) == 'string') {
                        data = jQuery.parseJSON(data);

                        if (data.hasOwnProperty("d")) {
                            data = JSON.stringify(data.d);
                        } else {
                            data = JSON.stringify(data);
                        }
                    }

                    return data;
                },
                success: function (data) {

                    result = data != true;
                }
            });

            return result;
        },
        message: '{4}已存在'
    },
    uniqueNot: { //是否存在，不存在返回false，存在返回true
        validator: function (value, param) {
            value = $.trim(value);
            var serviceUrl = param[0];
            var hiddenIdVal = $('#' + param[1]).val();
            var hiddenNameVal = $('#' + param[2]).val();
            hiddenNameVal = $.trim(hiddenNameVal);
            var paramName = param[3];
            var dataStr = '{' + paramName + ':"' + value + '"}';
            var result = false;
            if (hiddenIdVal.length > 0 && hiddenNameVal == value) {
                return false;
            }

            $.ajax({
                async: false,
                cache: false,
                url: serviceUrl,
                data: dataStr,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                dataFilter: function (data, type) {

                    if (type == 'json' && typeof (data) == 'string') {
                        data = jQuery.parseJSON(data);

                        if (data.hasOwnProperty("d")) {
                            data = JSON.stringify(data.d);
                        } else {
                            data = JSON.stringify(data);
                        }
                    }

                    return data;
                },
                success: function (data) {

                    result = data != false;
                }
            });

            return result;
        },
        message: '{4}'
    },
    uniqueValue: {
        validator: function (value, param) {
            value = $.trim(value);
            var serviceUrl = param[0];
            var hiddenIdVal = $('#' + param[1]).val();
            var hiddenNameVal = $('#' + param[2]).val();
            hiddenNameVal = $.trim(hiddenNameVal);
            var nameVal2 = $('#' + param[3]).combobox('getValue');
            nameVal2 = $.trim(nameVal2);
            var hiddenNameVal2 = $('#' + param[4]).val();
            hiddenNameVal2 = $.trim(hiddenNameVal2);
            var paramName = param[5];
            var paramName2 = param[6];
            var dataStr = '{' + paramName + ':"' + value + '",' + paramName2 + ':"' + nameVal2 + '"}';
            var result = false;
            if (nameVal2.length == 0) { return true; }
            if (hiddenIdVal.length > 0 && hiddenNameVal == value
                && nameVal2.length > 0 && hiddenNameVal2 == nameVal2) {
                return true;
            }

            $.ajax({
                async: false,
                cache: false,
                url: serviceUrl,
                data: dataStr,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                dataFilter: function (data, type) {

                    if (type == 'json' && typeof (data) == 'string') {
                        data = jQuery.parseJSON(data);

                        if (data.hasOwnProperty("d")) {
                            data = JSON.stringify(data.d);
                        } else {
                            data = JSON.stringify(data);
                        }
                    }

                    return data;
                },
                success: function (data) {

                    result = data != true;
                }
            });

            return result;
        },
        message: '{7}已存在'
    }
});

function clearValidate(formId) {
    $('#' + formId + ' .validatebox-invalid').blur()
                                             .removeClass('validatebox-invalid');
}

/********************************** combox重写 **********************************/

$.extend($.fn.combo.methods, {
    /**
    * 禁用combo文本域
    * @param {Object} jq
    * @param {Object} param stopArrowFocus:是否阻止点击下拉按钮时foucs文本域
    * activeTextArrow:是否激活点击文本域也显示下拉列表
    * stoptype:禁用类型，包含disable和readOnly两种方式
    */
    disableTextbox: function (jq, param) {
        return jq.each(function () {
            param = param || {};
            var textbox = $(this).combo("textbox");
            var that = this;
            var panel = $(this).combo("panel");
            var data = $(this).data('combo');
            if (param.stopArrowFocus) {
                data.stopArrowFocus = param.stopArrowFocus;
                var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
                arrowbox.unbind('click.combo').bind('click.combo', function () {
                    if (panel.is(":visible")) {
                        $(that).combo('hidePanel');
                    }
                    else {
                        $("div.combo-panel").panel("close");
                        $(that).combo('showPanel');
                    }
                });
                textbox.unbind('mousedown.mycombo').bind('mousedown.mycombo', function (e) {
                    e.preventDefault();
                });
            }
            if (param.activeTextArrow) {
                data.activeTextArrow = param.activeTextArrow;
                textbox.bind('click.mycombo', function () {
                    if (panel.is(":visible")) {
                        $(that).combo('hidePanel');
                    }
                    else {
                        $("div.combo-panel").panel("close");
                        $(that).combo('showPanel');
                    }
                });
            }
            textbox.prop(param.stoptype ? param.stoptype : 'disabled', true);
            data.stoptype = param.stoptype ? param.stoptype : 'disabled';
        });
    },
    /**
    * 还原文本域
    * @param {Object} jq
    */
    enableTextbox: function (jq) {
        return jq.each(function () {
            var textbox = $(this).combo("textbox");
            var data = $(this).data('combo');
            if (data.stopArrowFocus) {
                var that = this;
                var panel = $(this).combo("panel");
                var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
                arrowbox.unbind('click.combo').bind('click.combo', function () {
                    if (panel.is(":visible")) {
                        $(that).combo('hidePanel');
                    }
                    else {
                        $("div.combo-panel").panel("close");
                        $(that).combo('showPanel');
                    }
                    textbox.focus();
                });
                textbox.unbind('mousedown.mycombo');
                data.stopArrowFocus = null;
            }
            if (data.activeTextArrow) {
                textbox.unbind('click.mycombo');
                data.activeTextArrow = null;
            }
            textbox.prop(data.stoptype, false);
            data.stoptype = null;
        });
    }
});


//禁止输入、粘帖、拖放、输入法 by jjx
function disableInput(obj) {
    if (obj.onpaste != 'undefined')
        obj.onpaste = function () { return false; };
    obj.ondrop = function () { return false; };
    obj.onkeydown = function () { return false; };
    obj.onkeyup = function () { return false; };
}

//通用的搜索条件重置方法
//add by ys on 2013-6-8
//id为控件id，type为控件类型，ddl下拉框，txt文本框，isCombobox是否是combobox的下拉框
//可继续扩展
function resetSearchItems(id, type, isComboxStyle) {

    switch (type) {
        case 'ddl':
            if (isComboxStyle) {
                $("#" + id).combobox('select', '0');
            } else {
                //普通dll效果
            }
            break;
        case 'txt':
            $('#' + id).val('');
            break;
        default:
            break;
    }
}





//初始化HandleBars.js
function initTemplate(templateHolder, data, containHolder) {
    var source = $("#" + templateHolder).html();
    var template = Handlebars.compile(source);
    var html = template(data);
    $("#" + containHolder).html(html);
}


//扩展combobox : by jjx
// 使用方法和原来的combobox没有区别，方法名为htCombobox，加入了默认值，
// 这种扩展不会破坏原有方法的使用结构，方便使用
(function ($) {
    $.fn.htCombobox = function (option) {
        option = option || {};
        var lenObj = option.data || $(this).find('option');
        var length = lenObj.length;
        var defaults = {
            panelHeight: length > 10 ? 150 : 'auto',
            disabledText: true
        };
        option = $.extend(defaults, option);
        // 是否禁止输入text,默认禁止
        if (option.disabledText)
            $(this).combobox(option)
                .combobox('disableTextbox', { stoptype: 'readOnly', activeTextArrow: true, stopArrowFocus: true });
        else
            $(this).combobox(option);
    };
})(jQuery);

//为所有价格的input 绑定事件
//by 吴水丽 on 2013-8-9
function PriceFoucus(tableId) {
    $('#' + tableId + ' input[placeholderText]').bind({
        'focus': function () {
            //聚焦时，当它本身的值与默认值相同时，它的值为空
            if ($.trim($(this).val()) == $(this).attr('placeholderText')) {
                $(this).val('');
            }
        },
        'blur': function () {
            //失去焦点时，它的值为空，或者它的值就是本身的默认值，它的值为原始默认值
            if ($.trim($(this).val()) == '' || $.trim($(this).val()) == $(this).attr('placeholderText')) {
                $(this).numberbox('setValue', $(this).attr('placeholderText')).removeClass('validatebox-invalid');
            }
        }
    });
}

//textarea长度限制函数
//by ys
function isMaxLen(o) {
    var nMaxLen = o.getAttribute ? parseInt(o.getAttribute("maxlength")) : "";
    if (o.getAttribute && o.value.length > nMaxLen) {
        o.value = o.value.substring(0, nMaxLen);
    }
}

//判断一个js对象是否为数组
//处理元素为null的情况下初始化combo抛js错误的问题。
//by ys
function IsArrayType(array) {
    try { return !!array.push; } catch (e) { return false; }
}