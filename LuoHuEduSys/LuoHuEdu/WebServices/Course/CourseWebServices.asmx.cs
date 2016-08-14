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
    public class CourseWebServices : System.Web.Services.WebService
    {

        //获取课程列表数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetCourseList(int page, int rows, string sort, string order, CourseBo courseBo)
        {

            var courseService = new CourseService();
            var list = courseService.GetCourseList(page, rows, sort, order, courseBo);
            if (list != null)
            {
                return new
                {
                    total = list.TotalCount,
                    rows = list.ListT
                };
            }
            else
            {
                return new { total = 0, rows = 0 };
            }
        }
        /// <summary>
        /// 课程新增方法
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddCourse(CourseBo courseBo)
        {
            var courseService = new CourseService();
            return courseService.AddCourse(courseBo);
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateCourse(CourseBo courseBo)
        {
            var courseService = new CourseService();
            return courseService.UpdateCourse(courseBo);
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public CourseBo GetCourseById(string id)
        {
            var courseService = new CourseService();
            return courseService.GetCourseById(id);
        }

        /// <summary>
        /// 报名设置方法
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool ApplySet(CourseBo courseBo)
        {
            var courseService = new CourseService();
            return courseService.ApplySet(courseBo);
        }


    }
}
