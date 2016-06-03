using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using System.Web.Security;
using System.Configuration;
using System.Data;
using Domain.common;
using Page = System.Web.UI.Page;

namespace HuaTongCallCenter
{
    public partial class _Default : Page
    {


        protected void Page_Load(object sender, EventArgs e)
        {
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
            Response.Redirect("~/Login.aspx");
        }
    }
}
