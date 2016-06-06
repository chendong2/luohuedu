<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="HuaTongCallCenter.Login" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" id="html_hide">
<head runat="server">
    <title>登录</title>
    <link href="<%=Page.ResolveUrl("~/App_Themes/Global/global.css") %>" rel="stylesheet"
        type="text/css" />
    <link href="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/FormValidator/css/validationEngine.jquery.css") %>"
        rel="stylesheet" type="text/css" />
    <link href="<%=Page.ResolveUrl("~/App_Themes/Global/indexs.css") %>" rel="stylesheet"
        type="text/css" />
    <script type="text/javascript" src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/jquery.min.js") %>"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/FormValidator/jquery.validationEngine.js") %>"
        type="text/javascript" charset="utf-8"></script>
    <script src="<%=Page.ResolveUrl("~/Common/Scripts/JQuery/FormValidator/jquery.validationEngine-zh_CN.js") %>"
        type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
        if (window != top) top.location.href = '<%=Page.ResolveUrl("~/Login.aspx") %>';
    </script>
</head>
<body>
    <div class="wrap_box">
        <form id="form1" runat="server">
        <div class="login_main">
            <div class="login_content">
                <div class="login_Bg">
                    <asp:TextBox ID="txtUserName" runat="server" TabIndex="1" CssClass="textbox_color userNameBox validate[required]"
                        MaxLength="30">admin</asp:TextBox>
                    <asp:TextBox ID="txtPassword" runat="server" TabIndex="2" CssClass="textbox_color passwordBox validate[required]"
                        TextMode="Password" MaxLength="20"></asp:TextBox>
                    <asp:Button ID="btnLogin" runat="server" Text="" TabIndex="4" CssClass="login_btn"
                        OnClick="btnLogin_Click" />
                    <asp:Label ID="lblMsg" runat="server" class="lblmag"></asp:Label>
                    <div style="display:none">
                        <asp:Label ID="Label1" runat="server" class="lblmag"></asp:Label>
                        <asp:Label ID="Label2" runat="server" Text="Label"></asp:Label>
                    </div>
                </div>
            </div>
            <div class="copyRight">
               罗湖区教育科学研究中心 版权所有Copyright <span>&copy;</span> 2016</div>
        </div>
        </form>
        <script type="text/javascript">
            $(document).ready(function () {
                $("#form1").validationEngine('attach', { promptPosition: "bottomLeft" });
            });
        </script>
    </div>
</body>
</html>
