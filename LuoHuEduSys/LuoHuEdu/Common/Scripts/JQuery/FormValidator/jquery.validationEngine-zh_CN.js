(function ($) {
    $.fn.validationEngineLanguage = function () {
    };
    $.validationEngineLanguage = {
        newLang: function () {
            $.validationEngineLanguage.allRules = {
                "required": { // Add your regex rules here, you can take telephone as an example
                    "regex": "none",
                    "alertText": "* 必填",
                    "alertTextCheckboxMultiple": "* 请选择一个项目",
                    "alertTextCheckboxe": "* 您必须钩选此栏",
                    "alertTextDateRange": "* 日期范围不可空白"
                },
                "dateRange": {
                    "regex": "none",
                    "alertText": "* 无效的 ",
                    "alertText2": " 日期范围"
                },
                "dateTimeRange": {
                    "regex": "none",
                    "alertText": "* 无效的 ",
                    "alertText2": " 时间范围"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "* 最少 ",
                    "alertText2": " 个字符"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "* 最多 ",
                    "alertText2": " 个字符"
                },
                "groupRequired": {
                    "regex": "none",
                    "alertText": "* 你必需选填其中一个栏位"
                },
                "min": {
                    "regex": "none",
                    "alertText": "* 最小值为 "
                },
                "max": {
                    "regex": "none",
                    "alertText": "* 最大值为 "
                },
                "past": {
                    "regex": "none",
                    "alertText": "* 日期必需早于 "
                },
                "future": {
                    "regex": "none",
                    "alertText": "* 日期必需晚于 "
                },
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "* 最多选取 ",
                    "alertText2": " 个项目"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "* 请选择 ",
                    "alertText2": " 个项目"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "* 请输入与上面相同的密码"
                },
                "phone": {
                    // credit: jquery.h5validate.js / orefalo
                    /*
                     "regex": /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/,
                    "alertText": "* 无效的电话号码,如：0311-88888888"
                    */
                    "regex": /(^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
                    "alertText": "* 电话号码格式：3-4位区号，7-8位直播号码，1－4位分机号"
                },
                "telphone": {
                    "regex": /^((\()?\d{2}(\))?)?1\d{10}$/,
                    "alertText": "* 无效的手机号码,如：13500000000"
                },
                "qq": {
                    "regex": /^[1-9]\d{4,13}$/,
                    "alertText": "* 请输入有效的QQ帐号."
                },
                "fax": {
                    "regex": /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/,
                    "alertText": "* 请输入有效的传真号码,如：0311-88888888"
                },
                "guid": {
                    "regex": /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/,
                    "alertText": "* 请输入有效的游戏卡ID."
                },
                "email": {
                    // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
                    //"regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                    "regex": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    "alertText": "* 邮件地址无效"
                },
                "msn": {
                    "regex": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    "alertText": "* msn地址无效"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "* 不是有效的整数"
                },
                "coord": {
                    "regex": /^[\-\+]?(0?\d{1,2}\.\d{1,6}|1[0-8]?\d{1}\.\d{1,6}|180\.0{1,6})\,[\-\+]?([0-9]?\d{1}\.\d{1,6}|90\.0{1,6})$/,
                    "alertText": "* 无效的经纬度"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit: orefalo
                    "regex": /^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/,
                    "alertText": "* 无效的数字"
                },
                "onlyDoubleSp": {
                    //"regex": /^(0\.\d+)|([1-9][0-9]*(\.\d+)?)$/,
                    "regex": /^(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/,
                    "alertText": "* 不能是小于0的数"
                },
                "date": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
                    "alertText": "* 无效的日期，格式必需为 YYYY-MM-DD"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* 无效的 IP 地址"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "* Invalid URL"
                },
                "httpurl": {
                    "regex": /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
                    "alertText": "* 无效的Url地址，必须以http/https开头"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* 只能填数字"
                },
                "IdNum": {
                    "regex": /^(\d{17}([0-9]|[X|x]))$/,
                    "alertText": "* 无效的身份证号"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\ \']+$/,
                    "alertText": "* 只接受英文字母大小写"
                },
                "onlyLetterNumberLine": {
                    "regex": /^[a-zA-Z0-9_]+$/,
                    "alertText": "* 只接受字母或数字或者下划线"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "* 只接受字母或数字"
                },
                "onlyPositiveInt": {
                    "regex": /^[1-9]\d*$/,
                    "alertText": "* 只能是正数"
                },
                // --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
                "ajaxUserCall": {
                    "url": window.CheckUserUrl ? window.CheckUserUrl : "/Common/Handlers/ValidateCheck.ashx",
                    // you may want to pass extra data on the ajax call
                    "extraData": window.ExtraData ? window.ExtraData : "name=eric",
                    //"alertTextOk": "可以使用",
                    "alertText": "已存在"
                    //"alertTextLoad": "验证中，请稍等..."
                },
                "ajaxDataCall": {
                    "url": window.CheckUserUrl ? window.CheckUserUrl : "/Common/Handlers/AjaxValidate.ashx",
                    // you may want to pass extra data on the ajax call
                    "extraData": window.ExtraData1 ? window.ExtraData1 : "name=eric",
                    //"alertTextOk": "可以使用",
                    "alertText": "已存在"
                    //"alertTextLoad": "验证中，请稍等..."
                },
                "ajaxRoleNameCall": {
                    // remote json service location
                    "url": window._url + "CheckRoleName",
                    // error
                    "alertText": "* 此角色名已存在"
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    //"alertTextOk": "* 此角色名可以使用",
                    // speaks by itself
                    //"alertTextLoad": "* 正在验证中，请稍等"
                },
                "ajaxUserNameCall": {
                    // remote json service location
                    "url": window._url + "CheckUserName",
                    "extraDataDynamic": ['#hfUserName'],
                    // error
                    "alertText": "* 此用户名已存在"
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    //"alertTextOk": "* 此用户名可以使用",
                    // speaks by itself
                    //"alertTextLoad": "* 正在验证中，请稍等"
                },
                "ajaxEmailCall": {
                    // remote json service location
                    "url": window._url + "CheckEmail",
                    "extraDataDynamic": ['#hfEmailName'],
                    // error
                    "alertText": "* 此邮件已存在"
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    //"alertTextOk": "* 此邮件可以使用",
                    // speaks by itself
                    //"alertTextLoad": "* 正在验证中，请稍等"
                },
                //add cjk 2013-8-15
                //验证物业名称是否存在
                "ajaxTenementCall": {
                    "url": window._url + "CheckTenement",
                    "extraDataDynamic": ['#hfTenementName'],
                    "alertText": "* 物业名称重复"
                },
                //add cjk 2013-8-15
                //验证物业编号是否存在
                "ajaxTenementNoCall": {
                    "url": window._url + "CheckTenementNo",
                    "extraDataDynamic": ['#hfTenementNo'],
                    "alertText": "* 物业编号重复"
                },
                //验证合同编号是否重复
                "ajaxContractNumCall": {
                    "url": window._url + "CheckContractNum",
                    "extraDataDynamic": ['#hdfContractId'],
                    "alertText": "* 合同编号重复"
                },
                //验证单元名称是否重复
                "ajaxUnitNameCall": {
                    "url": window._url + "CheckUnitName",
                    "extraDataDynamic": ['#hdfId'],
                    "alertText": "* 单元名称重复"
                },
                //验证安全网格名称是否重复
                "ajaxSafeGridNameCall": {
                    "url": window._url + "CheckSafeGridName",
                    "extraDataDynamic": ['#hdfSafeGridId'],
                    "alertText": "* 安全网格名称重复"
                },

                "validate2fields": {
                    "alertText": "* 请选择"
                },
                //tls warning:homegrown not fielded 
                "dateFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
                    "alertText": "* 无效的日期格式"
                },
                //tls warning:homegrown not fielded 
                "dateTimeFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                    "alertText": "* 无效的日期或时间格式",
                    //"alertText2": "可接受的格式： ",
                    "alertText3": "mm/dd/yyyy hh:mm:ss AM|PM 或 ",
                    "alertText4": "yyyy-mm-dd hh:mm:ss AM|PM"
                },
                //组织机构代码       
                "code": {
                    "regex": /^[0-9]{8}-([\d]{1}|[a-zA-Z]{1})$/,
                    "alertText": "* 正确格式：12345678-9或12345678-X"
                },
                //邮政编码      
                "postcode": {
                    "regex": /^[0-9]\d{5}(?!\d)$/i,
                    "alertText": "* 6位数字"
                },
                //年龄
                "age": {
                    "regex": /^(?:[1-9][0-9]?|1[01][0-9]|120)$/,
                    "alertText": "* 请输入年龄，年龄应小于120岁"
                }
            };

        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);
