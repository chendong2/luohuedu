using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using Services.Course.CourseControl;

namespace LuoHuEduWebService.Course
{
    /// <summary>
    /// Course 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    // [System.Web.Script.Services.ScriptService]
    public class Course : System.Web.Services.WebService
    {

        [ScriptMethod]
        [WebMethod]
        public string GetCourseStudent(string idNo, string yearNo, string isAll)
        {

            var course = new CourseStudentService();
            var list = course.GetCourseStudent(idNo, yearNo, isAll);
            return new JavaScriptSerializer().Serialize(list);
        }
    }
}
