using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.AdminBo;
using BusinessObject.Course;
using BusinessObject.Parameter;
using Services.Admin.StudentControl;
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


        //获取授课教师列表数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetTeacherMessage(int page, int rows, string sort, string order, CourseBo courseBo)
        {

            var courseService = new AllCourseService();
            var list = courseService.GetTeacherMessage(page, rows, sort, order, courseBo);
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


        //培训课程信息列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetPerStudents(int page, int rows, string order, string sort, CourseBo courseBo,
            string studentId)
        {
            var courseService = new AllCourseService();
            var list = courseService.GetPerStudents(page, rows, sort, order, courseBo, studentId);
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

        //报名方法
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddCourseStudent(string userId, string courseId)
        {
            var courseService = new CourseStudentService();
            var studentBo = new CourseStudentDto();
            studentBo.CourseId = courseId;
            studentBo.StudentId = userId;
            studentBo.Sign = 1;
            studentBo.Feedback = 1;
            return courseService.AddCourseStudent(studentBo);
        }


        //判断是否可以报名
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool CanBaoMing(string courseId)
        {
            var courseService = new CourseStudentService();
            return courseService.CanBaoMing(courseId);
        }


        //获取考勤打印列表数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<CourseStudentDto> GetPrintCourseStudentData(string courseId)
        {

            var courseService = new AllCourseService();
            return courseService.GetPrintCourseStudentData(courseId);
        }

    }
}
