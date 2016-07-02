using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.Course;
using Services.Course.CourseControl;

namespace LuoHuEdu.WebServices.Course
{
    /// <summary>
    /// CourseWebServices 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    [System.Web.Script.Services.ScriptService]
    public class AllCourseServices : System.Web.Services.WebService
    {

        //获取课程列表数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public CourseBo GetMyColloctCourse(string theYear, string trainType)
        {

            var courseService = new AllCourseService();
            return courseService.GetMyColloctCourse(theYear, trainType);
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public CourseBo GetCount(string theYear)
        {

            var courseService = new AllCourseService();
            return courseService.GetCount(theYear);
        }


        //获取课程列表数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<CourseBo> GetMyCourseList(string theYear, string trainType)
        {

            var courseService = new AllCourseService();
            return courseService.GetMyCourseList(theYear, trainType);
        }
    }
}
