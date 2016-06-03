<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="HuaTongCallCenter._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
    <title>华通代理商分销系统</title>
    <link href="<%=Page.ResolveUrl("~/App_Themes/Global/global.css") %>" rel="stylesheet"
        type="text/css" />    
    <link href="<%=Page.ResolveUrl("~/App_Themes/EasyUI/default.css") %>" rel="stylesheet"
        type="text/css" />
    <link href="<%=Page.ResolveUrl("~/App_Themes/EasyUI/Themes/icon.css") %>" rel="stylesheet"
        type="text/css" />
    <link href="<%=Page.ResolveUrl("~/App_Themes/EasyUI/Themes/default/easyui.css") %>"
        rel="stylesheet" type="text/css" />
    <link href="<%=Page.ResolveUrl("~/App_Themes/System/system.css") %>" rel="stylesheet"
        type="text/css" />
    <link href="<%=Page.ResolveUrl("~/App_Themes/Menu/BigMenu.css") %>" rel="stylesheet"
        type="text/css" />
</head>
<body class="easyui-layout" scroll="no" style="vertical-align: top;">
    <noscript>
        <div class="easy_script">
            <img src="<%=Page.ResolveUrl("~/App_Themes/EasyUI/Images/noscript.gif") %>" alt='抱歉，请开启脚本支持！' />
        </div>
    </noscript>
    <!--页头-->
    <div id="north" border="false" region="north" split="false" class="default_head">
        <div class="head_bg">
            <div class="head_logo">
                <a style="cursor: default"></a>
            </div>
            <div class="user_bg clearfix">
                <form id="form1" runat="server">
                <ul class="clearfix">
                    <li style="padding: 0 12px 0 0;"><span class="user use">当前用户：<asp:Label ID="lblUser"
                        runat="server"></asp:Label></span></li>
                        <li style="padding: 0 12px 0 0;"><span>
                          <%--  <a id="extention" class="exit_btn" onclick="setExtention()"></a></span></li>--%>
                   <%--     <li style="padding: 0 12px 0 0;"><span>
                            <a id="lbtnCall" class="exit_btn" onclick="callNum(0)"></a></span></li>
                            <input type="hidden" id="phone"/>
                            <input type="hidden" id="phone1"/>--%>
                    <li class="loginsuccess" style="background: none;"><span>
                        <asp:LinkButton ID="lbtnLoginOut" runat="server" OnClick="lbtnLoginOut_Click" CssClass="exit_btn">安全退出</asp:LinkButton>
                        <asp:HiddenField ID="hfUserName" runat="server" />
                    </span></li>
                </ul>
                </form>
                <div class="user_bg_tip">
                    &nbsp;</div>
            </div>
        </div>
    </div>
    <!--导航菜单-->
    <div region="west" hide="true" split="false" title="导航菜单" style="width: 201px;" id="west">
        <div id="nav" class="easyui-accordion" fit="false" border="false" style="width: 199px;"
            enabled="false">
            <!--  导航内容 -->
        </div>
    </div>
    <!--主内容-->
    <div id="mainPanle" region="center" style="background: #fff; overflow-y: hidden">
        <div id="tabs" class="easyui-tabs " fit="true" border="false">
            <div title="欢迎页" style="padding: 0px; overflow: hidden; color: red;" id="defaultTab"
                closable="false">
                <div style="width: 100%; height: 680px; background: url(/App_Themes/Global/Images/wall.jpg) center center;
                    overflow: hidden" id="startShow">
                </div>
            </div>
        </div>
    </div>
    <!--标签右键信息-->
    <div id="mm" class="easyui-menu rightBord" style="width: 150px; display: none;">
        <div id="mm-tabupdate">
            刷新</div>
        <div class="menu-sep">
        </div>
        <div id="mm-tabclose">
            关闭</div>
        <div id="mm-tabcloseall">
            全部关闭</div>
        <div id="mm-tabcloseother">
            除此之外全部关闭</div>
        <div class="menu-sep">
        </div>
        <div id="mm-tabcloseright">
            当前页右侧全部关闭</div>
        <div id="mm-tabcloseleft">
            当前页左侧全部关闭</div>
    </div>
     <div id="extentionTemplate" style="display: none">
    </div>
     <div id="phoneTemplate" style="display: none">
    </div>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/jquery.min.js") %>" type="text/javascript"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/JqueryUI/commonjqueryui.js") %>"
        type="text/javascript" charset="utf-8"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/EasyUI/jquery.easyui.min.js") %>"
        type="text/javascript"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/EasyUI/jquery.layout.extend.js") %>"
        type="text/javascript"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/EasyUI/locale/easyui-lang-zh_CN.js") %>"
        type="text/javascript"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/Cookie/jquery.cookie.js") %>"
        type="text/javascript"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/EasyUI/easyui.public.js") %>"
        type="text/javascript"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/EasyUI/commoneasyui.js") %>"
        type="text/javascript"></script>    <script src="<%=Page.ResolveUrl("~/Module/Customer/CallNum.js") %>"
        type="text/javascript"></script>
    <!-- 菜单项加载 -->
    <script type="text/javascript">
        var menus_1 = [];
        var menus_2 = [];
        var menus_3 = [];
        var menus_4 = [];

        menus_1.push({ "menuid": "11", "menuname": "线上下单", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Ticket/ticketbook/BanciList.htm") %>' });
        menus_1.push({ "menuid": "41", "menuname": "电子库存", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Ticket/TicketList/TicketList.htm") %>' });
//        menus_1.push({ "menuid": "42", "menuname": "车票下单量统计", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Ticket/TicketStatistics/TicketOrderStatisticsList.htm") %>' });

//        menus_2.push({ "menuid": "21", "menuname": "包车预定", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Carrental/CarrentalRoute/CarrentalRouteList.htm") %>' });
//        menus_2.push({ "menuid": "22", "menuname": "包车订单", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Carrental/CarrentalOrder/CarrentalOrderList.htm") %>' });

//        menus_2.push({ "menuid": "23", "menuname": "自由行预定", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Free/FreeOrderPackageList.htm") %>' });
//        menus_2.push({ "menuid": "23", "menuname": "自由行订单", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Free/FreeOrderList.htm") %>' });

//        menus_3.push({ "menuid": "23", "menuname": "客户列表", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Customer/CustomerList.htm") %>' });

        menus_4.push({ "menuid": "41", "menuname": "科目设置", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Parameter/SubjectList.htm") %>' });
        menus_4.push({ "menuid": "42", "menuname": "修改密码", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/System/PswChange.htm") %>' });
//        menus_4.push({ "menuid": "42", "menuname": "消费记录", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/System/PswChange.htm") %>' });
//        menus_4.push({ "menuid": "43", "menuname": "充值记录", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/System/PswChange.htm") %>' });

        var _menus = { "menus": [
                        { "menuid": "1", "icon": "icon-sys", "menuname": "车票管理", "menus": menus_1 },

//						{ "menuid": "2", "icon": "icon-sys", "menuname": "包车管理", "menus": menus_2 },

//						{ "menuid": "3", "icon": "icon-sys", "menuname": "客户管理", "menus": menus_3 },

						{ "menuid": "4", "icon": "icon-sys", "menuname": "系统设置", "menus": menus_4 }
				]
        };
    </script>
</body>
</html>
