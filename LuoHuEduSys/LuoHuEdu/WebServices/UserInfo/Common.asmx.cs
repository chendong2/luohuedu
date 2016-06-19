using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.AdminBo;
using BusinessObject.UserInfo;
using Services.Parameter;
using Services.UserInfo;
using Services.Admin.StudentControl;

namespace LuoHuEdu.WebServices.UserInfo
{
    /// <summary>
    /// Summary description for Common
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class Common : System.Web.Services.WebService
    {

        //修改密码
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public int ChangeUserPsw(StudentBo studentBo)
        {

            var studentService = new StudentService();
            return studentService.ChangePassword(studentBo);
        }


    }
}
