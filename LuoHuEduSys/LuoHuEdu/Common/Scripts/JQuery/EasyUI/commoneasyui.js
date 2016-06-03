/***********************************
/* 修改人：wk
/* 修改日期：2011-11-1
***********************************/

$(document).ready(function () {
    InitLeftMenu();
    tabClose();
    tabCloseEven();
    setIframeFocus();
    InitTab();
});   //end $(document).ready();

//初始化Tab与menu关联关系
function InitTab() {
    $('#tabs').tabs({
        onSelect: function (title) {
            var tabNum = $('#tabs .tabs li');

            //当TAB个数达到12个时，则关闭第一个带关闭的TAB
            if (tabNum.length > 11) tabNum.children(".tabs-close").eq(0).click();

            setRemoveClass();

            var parentTitle = $('#tabs').tabs('getTab', title).children('iframe').attr('parent');
        
            //左侧菜单
            $('.easyui-accordion li a').each(function () {
                if ($(this).children('.nav').html() == title || $(this).children('.nav').text() == parentTitle) {
                    setSelectedClass(this);
                    return;
                }
            });
        }
    });
} // end InitTab()


//初始化左侧
function InitLeftMenu() {
    $("#nav").accordion({ animate: true });

    $.each(_menus.menus, function (i, n) {
        var menulist = '';
        menulist += '<ul>';
        $.each(n.menus, function (j, o) {

            /*
            * 2012-11-20 拆分代码，原代码如下：             *            
            * menulist += '<li><div class="' + o.divclass + '"><a ref="' + o.menuid + '" href="#" rel="' + o.url + '" ><span class="icon ' + o.icon + '" >&nbsp;</span><span class="nav">' + o.menuname + '</span></a></div></li> ';
            *
            */
            menulist += '<li>';
            menulist += '<div class="' + o.divclass + '"';

            //最后菜单去掉底部Border
            if (n.menus.length == (j + 1)) menulist += ' style="background:0 none;"';

            menulist += '><a ref="' + o.menuid + '" rel="' + o.url + '" >';
            menulist += '<span class="icon ' + o.icon + '" >&nbsp;</span>';
            menulist += '<span class="nav">';

            //处理重名标签
            menulist += '<span id="' + o.menuid + '" title="' + o.menuname + '">' + o.menuname + '</span>';

            menulist += '</span>';
            menulist += '</a>';
            menulist += '</div>';
            menulist += '</li>';

        });

        menulist += '</ul>';

        $('#nav').accordion('add', {
            title: n.menuname,
            content: menulist,
            iconCls: n.icon,
            collapsed: i == 0//是否展开
        });

        //modified by wyq 2012-9-1 为menu title 添加URL
        var div = $('.easyui-accordion div .panel-header');

        for (var q = 0; q < div.length; q++) {
            if (q == i) {
                div[q].setAttribute("rel", n.url);
            }
        }
    });         //end $.each()

    $('#nav').accordion({
        onSelect: function (title, index) {
            if (window.lastMenu && window.lastIcon) {
                $(window.lastMenu).removeClass(window.lastIcon + "_hover").addClass(window.lastIcon);
            }
            var icon = $('#nav').accordion('getSelected').panel('options').iconCls;
            $('#nav').accordion('getSelected').panel('header').children(".panel-icon").removeClass(icon).addClass(icon + "_hover");
            window.lastMenu = $('#nav').accordion('getSelected').panel('header').children(".panel-icon");
            window.lastIcon = icon;
            var p = $('#nav').accordion('getSelected');
            //            p.panel({
            //                onCollapse: function () {
            //                    alert("000");
            //                }
            //            });
        }
    });

    //    $.each($('#nav').accordion('panels'), function (i, n) {
    //        $(n).panel({
    //            onCollapse: function () {
    //                alert("000");
    //            }
    //        });
    //    });
    //    
    $('.easyui-accordion li a').click(function () {

        //如果当前链接处于变灰不可用状态，则不能打开TAB
        //alert($(this).prop("disabled"));
        if ($(this).prop("disabled")) {
            return;
        }

        //验证隐藏域的用户名和cookie的用户名是否一致
        //modify by lybohe on 2012-11-01
        checkUserCookie();

        var tabTitle = $(this).children('.nav,.panel-title').html();

        var url = $(this).attr("rel");
        var menuid = $(this).attr("ref");

        //icon处理 修改前代码getIcon(menuid,icon)  modify by lybohe on 2012-11-19
        var icon = getIcon(menuid);

        addTab(tabTitle, url, icon);

        setRemoveClass();
        setSelectedClass(this);

    }).hover(function () {
        var div = $(this).parent();
        if (div.prop("class").length == 0) {
            div.addClass("hover");
        }

    }, function () {
        var div = $(this).parent();
        div.removeClass("hover");

    });  //end $('.easyui-accordion li a').click().hover()

    /*
    * 去掉注释默认打开指定导航菜单 modify by lybohe on 2012-12-13
    * 默认打开第一个菜单项 $('.easyui-accordion .panel li a').first().click();
    * 默认打开第四个菜单项 $('.easyui-accordion .panel li a').eq(4).click();
    */

} //end InitLeftMenu()

/*
* 当Default页面Label用户名和Cookie用户名不一致的情况下，重新加载Default页面
* create by lybohe on 2013-04-06
*/
function checkUserCookie() {

    //获取Default页面Label控件的UserName值
    var labelUserName = parent.$("#hfUserName").val();
    //获取Default页面key为window.cookieKey的Cookie值
    //var cookieUserName = $.cookie(window.cookieKey);
    var cookieUserName = decodeURIComponent($.cookie(window.cookieKey));

    //当Label中的用户名和Cookie中的用户名不一致的情况下，进行跳转
    if (labelUserName && cookieUserName && cookieUserName != null) {
        if (labelUserName != cookieUserName) {
            window.location.href = 'Default.aspx';
        }
    } //end：if (labelUserName && cookieUserName && cookieUserName != null) 
}

//移除所有菜单
function RemoveMenu() {
    $.each(_menus.menus, function (i, n) {
        $("#nav").accordion('remove', n.menuname);
    });
}

//获取左侧导航的图标
function getIcon(menuid) {
    var icon = 'icon ';
    $.each(_menus.menus, function (i, n) {
        $.each(n.menus, function (j, o) {
            if (o.menuid == menuid) {
                icon += o.icon;
            } //end if (o.menuid == menuid)
        });
    });

    return icon;

} //end getIcon()

//移除样式
function setRemoveClass() {
    $(".menu_right li a,#form1 ul.clearfix li a").removeAttr("style");
    $("#nav ul div.selected").removeClass("selected");
}

//选中样式
function setSelectedClass(menu) {
    var div = $(menu).parent();
    var bodydiv = div.parents("div.accordion-body");

    if (bodydiv.is(":hidden")) bodydiv.prev().click();

    div.addClass("selected");
} //end setSelectedClass()

function addTab(subtitle, url, icon, parenttitle) {
    if (url == null || url == "undefined" || url == '') return;

    var subtitleArr = subtitle.split('_');
    var update = null;

    if (icon == null || icon == "") icon = "icon";

    subtitle = subtitleArr[0];

    if (subtitleArr.length > 0) {
        update = subtitleArr[1];
    }

    if (!$('#tabs').tabs('exists', subtitle)) {

        $('#tabs').tabs('add', {
            title: subtitle,
            content: createFrame(url, parenttitle),
            closable: true,
            icon: icon
        });

    } else {

        $('#tabs').tabs('select', subtitle);

        if (update != null) {
            updateTab(url);
        }
        else {
            $('#mm-tabupdate').click();
        }
    }

    $("#tabs").data("title", subtitle);

    //$("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
    //$("<div class=\"datagrid-mask-msg\"></div>").html("正在加载，请稍候...").appendTo("body").css({ display:"block", left:($(document.body).outerWidth(true) - 190) / 2, top:($(window).height() - 45) / 2 });

    tabClose();

} //end addTab()

function createFrame(url, parenttitle) {
    var parent = "";
    if (typeof (parenttitle) != "undefined" && parenttitle != "") {
        parent = ' parent="' + parenttitle + '"';
    }
    var s = '<iframe scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;"' + parent + '></iframe>';
    return s;

} //end createFrame(url)

function tabClose() {
    /*双击关闭TAB选项卡*/
    $(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children(".tabs-closable").html();
        $('#tabs').tabs('close', subtitle);
    });

    /*为选项卡绑定右键*/
    $(".tabs-inner").bind('contextmenu', function (e) {
        if ($(this).next().length == 0) return false;

        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        }).data("currtab", $(this));

        $(this).click();
        return false;
    });

} //end tabClose()

function updateTab(url) {

    var currTab = $('#tabs').tabs('getSelected');

    $('#tabs').tabs('update', {
        tab: currTab,
        options: {
            content: createFrame(url)
        }
    });

} //end updateTab()

function closeCurrentTab() {
    var currtabTitle = $('a:eq(0)', $('.tabs-selected')).children(".tabs-closable").html();
    $('#tabs').tabs('close', currtabTitle);
}

//绑定右键菜单事件
function tabCloseEven() {
    //刷新
    $('#mm-tabupdate').click(function () {
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');

        if (url != undefined) {
            updateTab(url);
        }
    });

    //关闭当前
    $('#mm-tabclose').click(function () {
        var currtab_title = $('#mm').data("currtab").children(".tabs-closable").html();
        $('#tabs').tabs('close', currtab_title);
        return false;
    });

    //全部关闭
    $('#mm-tabcloseall').click(function () {
        $('.tabs-inner').each(function (i, n) {
            var t = $(n).children(".tabs-closable").html();
            $('#tabs').tabs('close', t);
        });
        return false;
    });

    //关闭除当前之外的TAB
    $('#mm-tabcloseother').click(function () {

        var tabother = $(".tabs li").not(".tabs-selected");
        if (tabother.length == 0) return false;

        tabother.each(function (i, n) {
            $('#tabs').tabs('close', $('a:eq(0)', $(n)).children(".tabs-closable").html());
        });
        return false;
    });


    //关闭当前右侧的TAB
    $('#mm-tabcloseright').click(function () {
        var nextall = $('.tabs-selected').nextAll();
        if (nextall.length == 0) {
            return false;
        }
        nextall.each(function (i, n) {
            var t = $('a:eq(0)', $(n)).children(".tabs-closable").html();
            $('#tabs').tabs('close', t);
        });
        return false;
    });


    //关闭当前左侧的TAB
    $('#mm-tabcloseleft').click(function () {
        var prevall = $('.tabs-selected').prevAll();
        if (prevall.length == 0) {
            return false;
        }
        prevall.each(function (i, n) {
            var t = $('a:eq(0)', $(n)).children(".tabs-closable").html();
            $('#tabs').tabs('close', t);
        });
        return false;
    });

    //退出
    //$("#mm-exit").click(function() {
    //    $('#mm').menu('hide');
    //});

} //end tabCloseEven()

//弹出信息窗口 title:标题 msgString:提示信息 msgType:信息类型 [error,info,question,warning]
function msgShow(title, msgString, msgType) {
    $.messager.alert(title, msgString, msgType);
} //end msgShow()

//--------------------------------------------------------------------------------------------------------//
//确定信息
//create by wk on 2011-7-19
function confirm(title, message, fun) {

    $.messager.confirm(title, message, function (isOK) {
        if (isOK) {
            eval(fun);
        }
    });
} //end confirm()

//防止点击其他TAB时出现光标闪烁或日期控件弹出之后没有关闭
//create by wk on 2011-8-31
function setIframeFocus() {
    $(".tabs li").live("click", function () {
        var getTab = $('#tabs').tabs('getSelected');
        var iframes = getTab.find('iframe');
        if (iframes.length > 0) {
            iframes.contents().find("body").focus();
        }
    }); //end $(".tabs li").live()

} //end setIframeFocus()

function checkIframe() {
    var iframe = $(".tabs-panels .panel:not([style*=display])").find("iframe")[0];
    if (iframe.attachEvent) {
        iframe.attachEvent("onload", function () {
            $(".datagrid-mask,.datagrid-mask-msg").remove();
        });
    }
    else {
        iframe.onload = function () {
            $(".datagrid-mask,.datagrid-mask-msg").remove();
        };
    }
}