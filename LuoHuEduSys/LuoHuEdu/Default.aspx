﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="HuaTongCallCenter._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <%-- <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />--%>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="renderer" content="webkit">
    <title>罗湖中小学继续教育系统</title>
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
    <%--<link rel="stylesheet" type="text/css" href="/App_Themes/Global/Reset.css" />--%>
    <style>
            .custom_forms_popup2
        {
	        border-collapse: collapse;
	        clear: both;
	        font-size:14px;
	        font-weight: normal;
	        margin: 20px auto;
	        text-align: center;
	        vertical-align: middle;
	        width:600px;
	        word-break: break-all; 
	        color:#333333; 
	        border:none; 
	        border-top:1px #dfdfdf dotted;
        }

        .custom_forms_popup2 td
        {
            border: 1px solid black;	  
            vertical-align:middle;
            text-align:center;
            padding:5px;
            height:25px;
        }
         
    </style>
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
                    <li style="padding: 0 12px 0 0;">
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
                <div style="width: 100%; height: 680px; overflow: hidden; text-align: center;" id="startShow">
                    <table width="600px;" class="custom_forms_popup2" style="border: 1px solid black">
                        <tr>
                            <td colspan="8" style="text-align: center; font-weight: bolder;">
                                提示学员请根据自己的角色下载对应使用手册
                            </td>
                        </tr>
                        <tr>
                            <td style="font-weight: bolder; background-color: #f6f6f6;">
                                序号
                            </td>
                            <td style="font-weight: bolder; background-color: #f6f6f6;">
                                手册名称
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                <a href="Common/UploadFiles/File/罗湖中小学继续教育系统使用手册(普通教师).doc" ><font color="#FF0000">普通教师操作手册</font></a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                               2
                            </td>
                            <td>
                                <a href="Common/UploadFiles/File/罗湖中小学继续教育系统使用手册 （学校管理员）.doc" ><font color="#FF0000">校管理员操作手册</font></a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                              3
                            </td>
                            <td>
                                <a href="#" ><font color="#FF0000">区管理员操作手册</font></a>
                            </td>
                        </tr>
                    </table>
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
        type="text/javascript"></script>
    <script src="<%=Page.ResolveUrl("~/Module/Customer/CallNum.js") %>" type="text/javascript"></script>
    <!-- 菜单项加载 -->
    <script type="text/javascript">
        var menus_1 = [];
        var menus_2 = [];
        var menus_3 = [];
        var menus_4 = [];
        var menus_5 = [];

        var perStr = decodeURIComponent($.cookie('perList'));
        if (perStr.indexOf("课程浏览") > -1 || perStr.indexOf("课程报名") > -1) {
        menus_1.push({ "menuid": "11", "menuname": "培训课程信息", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Course/CourseList.htm") %>' });
         }

         if (perStr.indexOf("我的培训记录") > -1) {
        menus_1.push({ "menuid": "12", "menuname": "我的培训记录", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Admin/MyCourse/MyCourseList.htm") %>' });
         }
        if (perStr.indexOf("历史课程信息") > -1) {
        menus_1.push({ "menuid": "13", "menuname": "历史课程信息", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Admin/MyCourse/MyCourseList.htm") %>' });
         }

        if (perStr.indexOf("我是授课教师") > -1) {
        menus_1.push({ "menuid": "14", "menuname": "我是授课教师", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Admin/MyTeacher/MyTeacherList.htm") %>' });
         }
        if (perStr.indexOf("历史课程信息") > -1) {
        menus_1.push({ "menuid": "15", "menuname": "历史课程信息(老)", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/OldCourseInfoSingle/CourseList.htm") %>' });
         }
        if (perStr.indexOf("培训浏览") > -1 || perStr.indexOf("培训审核") > -1 || perStr.indexOf("培训锁定") > -1) {
            menus_2.push({ "menuid": "21", "menuname": "培训管理", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/TrainingManage/TrainingCourseManage/TrainingCourseList.htm") %>' });
        }
        if (perStr.indexOf("考勤管理（老）") > -1) {
            menus_2.push({ "menuid": "22", "menuname": "考勤管理（旧）", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/CourseStudenttemp/CourseList.htm") %>' });
        }
        if (perStr.indexOf("老数据") > -1) {
            menus_2.push({ "menuid": "66", "menuname": "老系统数据", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/OldCourseInfo/CourseList.htm") %>' });
        }
        if (perStr.indexOf("考勤管理") > -1) {
            menus_2.push({ "menuid": "29", "menuname": "考勤管理（新）", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/AttendanceReport/CourseList.htm") %>' });
        }
        if (perStr.indexOf("授课教师信息") > -1) {
            menus_2.push({ "menuid": "23", "menuname": "授课教师信息", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/TrainingManage/TeacherMessage/TeacherMessageList.htm") %>' });
        }
        if (perStr.indexOf("校本研修审核") > -1) {
            menus_2.push({ "menuid": "24", "menuname": "校本研修审核", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/TrainingManage/TrainManage/TrainManageList.htm") %>' });
        }
        if (perStr.indexOf("免修审核") > -1) {
            menus_2.push({ "menuid": "25", "menuname": "免修审核", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/TrainingManage/ExemptionManage/ExemptionManageList.htm") %>' });
        }
                if (perStr.indexOf("学员管理") > -1) {
                    menus_2.push({ "menuid": "26", "menuname": "学员管理", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Admin/Student/StudentCourseList.htm") %>' });
                }
        if (perStr.indexOf("学员信息管理") > -1) {
            menus_2.push({ "menuid": "27", "menuname": "学员信息管理", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Admin/Student/StudentList.htm") %>' });
        }
        if (perStr.indexOf("权限管理") > -1) {
            menus_2.push({ "menuid": "28", "menuname": "权限管理", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Admin/UserPermissions/PermissionsList.htm") %>' });
        }

        //        if (perStr.indexOf("校本研修登记") > -1) {
        //            menus_3.push({ "menuid": "31", "menuname": "校本研修登记", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/UserInfo/StudentTrain/StudentTrainList.htm") %>' });
        //        }
        //        if (perStr.indexOf("免修登记") > -1) {
        //            menus_3.push({ "menuid": "32", "menuname": "免修登记", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/UserInfo/StudentExemption/StudentExemptionList.htm") %>' });
        //        }
        if (perStr.indexOf("培训详细列表") > -1) {
            menus_3.push({ "menuid": "33", "menuname": "培训详细列表", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/UserInfo/AllCourse/CourseInfo.htm") %>' });
        }

        if (perStr.indexOf("科目设置") > -1) {
            menus_4.push({ "menuid": "41", "menuname": "科目设置", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Parameter/Subject/SubjectList.htm") %>' });
        } if (perStr.indexOf("类型设置") > -1) {
            menus_4.push({ "menuid": "42", "menuname": "类型设置", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Parameter/TrainType/TrainTypeList.htm") %>' });
        } if (perStr.indexOf("研修设置") > -1) {
            menus_4.push({ "menuid": "43", "menuname": "研修设置", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Parameter/MaintrainSet/MaintrainSetList.htm") %>' });
        } if (perStr.indexOf("免修设置") > -1) {
            menus_4.push({ "menuid": "44", "menuname": "免修设置", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Parameter/Exemption/ExemptionList.htm") %>' });
        } if (perStr.indexOf("教办设置") > -1) {
            menus_4.push({ "menuid": "45", "menuname": "教办设置", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Parameter/EducationOffice/EducationOfficeList.htm") %>' });
        } if (perStr.indexOf("单位设置") > -1) {
            menus_4.push({ "menuid": "46", "menuname": "单位设置", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/Parameter/School/SchoolList.htm") %>' });
        }
        menus_3.push({ "menuid": "34", "menuname": "个人信息", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/System/UserInfo.htm") %>' });

        if (perStr.indexOf("校本培训") > -1) {
            menus_5.push({ "menuid": "51", "menuname": "校本培训", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/xiaobenyanxiu/XiaoBenTrainingCourseList.htm") %>' });
        }
        if (perStr.indexOf("校本培训") > -1) {
            menus_5.push({ "menuid": "52", "menuname": "学员信息管理", "icon": "icon-nav", "divclass": "", "url": '<%=Page.ResolveUrl("~/View/StudentXueXiaoGuanLi/XiaoGuanLiStudentList.htm") %>' });
        }



        var _menus = { "menus": [
                        ]
        };
        if (menus_1.length > 0) {
            _menus.menus.push({ "menuid": "1", "icon": "icon-sys", "menuname": "培训信息", "menus": menus_1 });
        }
        if (menus_2.length > 0) {
            _menus.menus.push({ "menuid": "2", "icon": "icon-sys", "menuname": "培训管理", "menus": menus_2 });
        }
        if (menus_3.length > 0) {
            _menus.menus.push({ "menuid": "3", "icon": "icon-sys", "menuname": "用户信息", "menus": menus_3 });
        }
        if (menus_4.length > 0) {
            _menus.menus.push({ "menuid": "4", "icon": "icon-sys", "menuname": "参数管理", "menus": menus_4 });
        }
        if (menus_5.length > 0) {
            _menus.menus.push({ "menuid": "5", "icon": "icon-sys", "menuname": "校本管理", "menus": menus_5 });
        }    
    </script>
</body>
</html>
