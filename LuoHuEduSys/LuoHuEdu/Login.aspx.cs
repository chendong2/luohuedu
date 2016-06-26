using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI.WebControls;
using System.Web.Security;
using System.Configuration;
using Domain.common;
using Services.Admin.Permissions;
using Services.Admin.StudentControl;
using Page = System.Web.UI.Page;
using BusinessObject.AdminBo;
namespace HuaTongCallCenter
{
    public partial class Login : Page
    {
        //全局，获取admin服务
       
        public Login()
        {
           
        }

        #region 页面事件

        protected void Page_Init(object sender, EventArgs e)
        {
            if (Session["UserId"] != null && Session["UserName"] != null)
            {
                Response.Redirect("~/Default.aspx");
            }

            Session.Contents.Remove("UserId");
            Session.Contents.Remove("UserName");
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["ErrorInfo"] == null) return;
            Page.ClientScript.RegisterStartupScript(GetType(), "error",
                                                    "$.messager.show({id:'msg',timeout:2300,height:50,msg:'" + Session["ErrorInfo"] + "',showType:'fade',style:{right:'',bottom:''}});",
                                                    true);
            Session["ErrorInfo"] = null;
        }


        #endregion

        #region 事件：登录

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            //添加只能代理商帐号才能登录后台
            StudentService studentService=new StudentService();
            var bo = studentService.VipLogin(txtUserName.Text, txtPassword.Text);
            if (bo == null)
            {
                Session["ErrorInfo"] = "密码错误或未授权账户，登录失败!";
                Response.Redirect("~/Login.aspx");
            }

            Session.Add("UserId", bo.Id);
            Session.Add("UserName", bo.UserName);
            HttpCookie useridC = new HttpCookie("UserId") { Value = bo.Id.ToString(CultureInfo.InvariantCulture), Path = "/" };
            HttpCookie userNameC = new HttpCookie("UserName") { Value = bo.UserName, Path = "/" };
            Response.Cookies.Add(useridC);
            Response.Cookies.Add(userNameC);

            //获取权限
            var pService = new PermissionsService();
            string perList=pService.getUserPermissionsList(bo.Id);
            Session.Add("perList", perList);

            HttpCookie perListC = new HttpCookie("perList") { Value = HttpUtility.UrlEncode(perList, Encoding.GetEncoding("UTF=8")), Path = "/" };
            Response.Cookies.Add(perListC);

            Response.Redirect("~/Default.aspx");
        }

        #endregion
    }
}
