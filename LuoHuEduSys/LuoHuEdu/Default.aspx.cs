﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
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
            //注释掉的代码为同步抓取老系统考勤数据方法，不要删除
            //WebClient aa=new WebClient();
            //aa.Encoding = System.Text.Encoding.UTF8;
            //StudentService student =new StudentService();
            //CourseStudentTempOldService courseStudentTemp=new CourseStudentTempOldService();
            //var list = student.GetListIdNo();
            //if (list.Count > 0)
            //{
            //    foreach (var linshiBo in list)
            //    {
            //        string strurl =
            //        @"http://219.223.7.19:81/api/api-jsonIdno.php?usid=szsjky&echostr=8e3340e111ef9e7e44f741b105242fcfe236c23e&IDNO=";
            //        strurl=strurl+linshiBo.IDNo;
            //        string result =aa.DownloadString(strurl);
            //        var mm = Newtonsoft.Json.JsonConvert.DeserializeObject<IList<CourseStudentTempOldBo>>(result);
            //        if (mm != null)
            //        {
            //            if (mm.Count > 0)
            //            {
            //                foreach (var courseStudentTempBo in mm)
            //                {
            //                    courseStudentTemp.AddCourseStudentTempOld(courseStudentTempBo);
            //                }
            //            }
            //        }
            //    }
            //}
           

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
                Response.Redirect("~/Login.aspx");
            }
        }

        protected void lbtnLoginOut_Click(object sender, EventArgs e)
        {
            Session.Contents.Remove("UserId");
            Session.Contents.Remove("UserName");
            Session.Contents.Remove("perList");
            Response.Redirect("~/Login.aspx");
        }
    }
}
