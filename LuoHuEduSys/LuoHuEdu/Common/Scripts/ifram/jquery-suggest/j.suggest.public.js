/******************************************
/* 创建人：wk
/* 修改人：wk
/* 修改日期：2013-5-30
/* 主要是对城市选择插件j.suggest的封装
/* 依赖：jquery.js,j.suggest.js,aircity.js
******************************************/
//初始化城市选择下拉
function suggest(suggestId,suggestOptions) {

    var settings = {
        hot_list: commoncitys
    };

    settings = $.extend(settings, suggestOptions);

    $("#"+ suggestId).suggest(citys, settings);

}

//初始化下拉提示的位置，根据已打开弹出层的表单来定位
function SuggestPositionInit(suggestId, divSuggestId) {
    var jqSuggest = $('#' + suggestId);
    var position = jqSuggest.position();
    var pLeft = position.left;
    var pTop = position.top;
    var pHeight = pTop + jqSuggest[0].offsetHeight;
    $('#' + divSuggestId).css({ top: pHeight, left: pLeft });
}

