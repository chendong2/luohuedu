using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services.Description;
using System.Web.UI.WebControls;
using System.Web.Security;
using System.Configuration;
using System.Data;
using BusinessObject.Course;
using Domain.common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Services.Admin.Permissions;
using Services.Admin.StudentControl;
using Services.Course.CourseStudentTemp;
using Page = System.Web.UI.Page;

namespace HuaTongCallCenter
{
    public partial class _Default : Page
    {


        protected void Page_Load(object sender, EventArgs e)
        {
            //获取权限
            var pService = new PermissionsService();
            string perList = pService.getUserPermissionsList(HttpContext.Current.Session["UserId"].ToString());
            Session.Add("perList", perList);
  
            HttpCookie perListC = new HttpCookie("perList") { Value = HttpUtility.UrlEncode(perList, Encoding.GetEncoding("UTF-8")), Path = "/" };
            Response.Cookies.Add(perListC);

            if(perList.Length<1)
            {
                this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(), "提示", "<script type='text/javascript'>msgShow('提示', '请进入个人信息页面完善您的真实信息，否则将无法使用本系统！', 'info');</script>");       
            }

            if (!IsPostBack)
            {
                lblUser.Text = UserInfo.GetUserName();
            }
        }

        protected void Page_Init(object sender, EventArgs e)
        {
            if (Session["UserId"] == null || Session["UserName"] == null)
            {
                Session.Contents.Remove("UserId");
                Session.Contents.Remove("UserName");
                //Response.Redirect("~/Login.aspx");
                Response.Redirect("http://web.luohuedu.net/pxzx_login.aspx?url=219.223.4.186/Login.aspx");
            }
        }

        protected void lbtnLoginOut_Click(object sender, EventArgs e)
        {
            Session.Contents.Remove("UserId");
            Session.Contents.Remove("UserName");
            Session.Contents.Remove("perList");
         
           Response.Redirect("http://web.luohuedu.net/pxzx_login.aspx?url=localhost:23007/Login.aspx");
           //Response.Redirect("http://web.luohuedu.net/pxzx_login.aspx?url=219.223.4.186/Login.aspx");
        }
    }
}
