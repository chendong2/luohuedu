using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI.WebControls;
using System.Web.Security;
using System.Configuration;
using System.Xml;
using Domain.common;
using Services.Admin.Permissions;
using Services.Admin.StudentControl;
using Services.Parameter;
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
            string id=Request.QueryString["id"];
            string userid = Request.QueryString["userid"];
            string passwdmd5 = Request.QueryString["passwd_md5"];
            if(id!=null &&userid!=null &&passwdmd5!=null){
              string ServerPage = "http://www.luohuedu.net/user_WebService.asmx/checkuser";
              try
              {
                  StudentService studentService=new StudentService();
                  string postData = "id=" + id + "&userid=" + userid + "&passwd_md5_1=" + passwdmd5;
                  string res = HttpConnectToServer(ServerPage, postData);
                  DataSet ds = GetDataSet(res);
                  if(ds.Tables.Count>0)
                  {
                      DataTable dt = ds.Tables[0];
                      string username = dt.Rows[0][0].ToString();//userid
                      string loginid = dt.Rows[0][1].ToString();
                      int sex = Convert.ToInt32(dt.Rows[0][2])==0?1:2;
                      string schoolcode = dt.Rows[0][3].ToString();

                      StudentBo stBo = studentService.GetAllStudentByLoginid(loginid);
                      var ss=new SchoolService();
                      string schoolId = ss.GetSchoolIdBycode(schoolcode);
                    
                      if (stBo!= null)
                      {
                          stBo.SchoolId = schoolId;
                          studentService.UpdateStudent(stBo);

                          Session.Add("UserId", stBo.Id);
                          Session.Add("UserName", stBo.UserName);
                          var useridC = new HttpCookie("UserId") { Value = stBo.Id.ToString(CultureInfo.InvariantCulture), Path = "/" };
                          var userNameC = new HttpCookie("UserName") { Value = stBo.UserName, Path = "/" };
                          Response.Cookies.Add(useridC);
                          Response.Cookies.Add(userNameC);

                         //获取权限
                          var pService = new PermissionsService();
                          string perList = pService.getUserPermissionsList(stBo.Id);
                          Session.Add("perList", perList);

                          var  perListC = new HttpCookie("perList") { Value = HttpUtility.UrlEncode(perList, Encoding.GetEncoding("UTF-8")), Path = "/" };
                          Response.Cookies.Add(perListC);
                      }
                      else
                      {
                          StudentBo sBo = new StudentBo();
                          sBo.Name = username;
                          sBo.UserName = username;
                          sBo.LoginId = loginid;
                          sBo.Sex = sex;
                          sBo.SchoolId = schoolId;
                          studentService.AddStudent(sBo);

                          Session.Add("UserId", sBo.Id);
                          Session.Add("UserName", sBo.UserName);
                          HttpCookie useridC = new HttpCookie("UserId") { Value = sBo.Id.ToString(CultureInfo.InvariantCulture), Path = "/" };
                          HttpCookie userNameC = new HttpCookie("UserName") { Value = sBo.UserName, Path = "/" };
                          Response.Cookies.Add(useridC);
                          Response.Cookies.Add(userNameC);

                          //获取权限
                          var pService = new PermissionsService();
                          string perList = pService.getUserPermissionsList(sBo.Id);
                          Session.Add("perList", perList);

                          HttpCookie perListC = new HttpCookie("perList") { Value = HttpUtility.UrlEncode(perList, Encoding.GetEncoding("UTF-8")), Path = "/" };
                          Response.Cookies.Add(perListC);
                      }
                      Response.Redirect("~/Default.aspx");
                  }
              }
              catch (Exception ex)
              {
                //
              }
            }
        }

        //发送消息到服务器
        public static string HttpConnectToServer(string ServerPage, string postData)
        {

            byte[] dataArray = Encoding.Default.GetBytes(postData);
            //创建请求
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(ServerPage);
            request.Method = "POST";
            request.ContentLength = dataArray.Length;
            request.ContentType = "application/x-www-form-urlencoded";
            //创建输入流
            Stream dataStream = null;
            try
            {
                dataStream = request.GetRequestStream();
            }
            catch (Exception)
            {
                return null;//连接服务器失败
            }

            //发送请求
            dataStream.Write(dataArray, 0, dataArray.Length);
            dataStream.Close();
            //读取返回消息
            string res = string.Empty;
            try
            {
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
                res = reader.ReadToEnd();
                reader.Close();
            }
            catch (Exception ex)
            {
                return null;//连接服务器失败
            }
            return res;
        }


        private DataSet GetDataSet(string text)
        {
            try
            {
                XmlTextReader reader = new XmlTextReader(new StringReader(text));
                reader.WhitespaceHandling = WhitespaceHandling.None;
                DataSet ds = new DataSet();
                ds.ReadXml(reader);
                reader.Close();
                ds.Dispose();
                return ds;
            }
            catch
            {
                return null;
            }
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

            HttpCookie perListC = new HttpCookie("perList") { Value = HttpUtility.UrlEncode(perList, Encoding.GetEncoding("UTF-8")), Path = "/" };
            Response.Cookies.Add(perListC);

            Response.Redirect("~/Default.aspx");
        }

        #endregion
    }
}
