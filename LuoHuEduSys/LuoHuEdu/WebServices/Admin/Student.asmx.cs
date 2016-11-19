using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.AdminBo;
using BusinessObject.Parameter;
using Domain.common;
using Services.Admin.StudentControl;
using Services.Course.CourseControl;

namespace LuoHuEdu.WebServices.Admin
{
    /// <summary>
    /// Summary description for Student
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class Student : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddStudent(StudentBo studentBo)
        {

            var studentService = new StudentService();
            return studentService.AddStudent(studentBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateStudent(StudentBo studentBo)
        {

            var studentService = new StudentService();
            return studentService.UpdateStudent(studentBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateStudentNew(StudentBo studentBo)
        {
            studentBo.State = 1;
            var studentService = new StudentService();
            return studentService.UpdateStudent(studentBo);
        }

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteStudentsByIds(String ids)
        {
            var studentService = new StudentService();
            return studentService.DeleteStudentsByIds(ids);
        }


        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetStudentList(int page, int rows, string sort, string order, StudentBo studentBo)
        {

            var student = new StudentService();
            var list = student.GetStudents(page, rows, sort, order, studentBo);
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



        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetStudentListNew(int page, int rows, string sort, string order, StudentBo studentBo)
        {

            var student = new StudentService();
            var list = student.GetStudentsNew(page, rows, sort, order, studentBo);
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

        //根据Id获取数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public StudentBo GetAllStudentById(String id)
        {

            var studentService = new StudentService();
            var studentBo = studentService.GetAllStudentById(id);
            return studentBo;
        }


        //根据Id获取数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public StudentBo GetAllStudent()
        {
            var id = Domain.common.UserInfo.GetUserId().ToString();
            var studentService = new StudentService();
            var studentBo = studentService.GetAllStudentById1(id);
            return studentBo;
        }



        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetStudentCourseList(int page, int rows, string sort, string order, StudentBo studentBo)
        {

            var student = new StudentService();
            var list = student.GetStudentCourseList(page, rows, sort, order, studentBo);
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
        /// 获取所有教师信息
        /// </summary>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<StudentFaceBo> GetAllStudents()
        {
            var student = new StudentService();

            return student.GetAllStudents();
        }


        /// <summary>
        /// 获取所有考勤信息
        /// </summary>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetKaoqingList(int page, int rows, string sort, string order, StudentBo studentBo)
        {
            var student = new StudentService();
            var list = student.GetKaoqingList(page, rows, sort, order, studentBo);
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


        //签到
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool StudentQianDao(String id)
        {
            var studentService = new CourseStudentService();
            return studentService.StudentQianDao(id);
        }

        //结算课程给予课时
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool CourseJieSuan(string id)
        {
            var studentService = new CourseStudentService();
            return studentService.CourseJieSun(id);
        }

        //结算课程给予课时
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool CourseJieSuan2(string id)
        {
            var studentService = new CourseStudentService();
            return studentService.CourseJieSun2(id);
        }

        //取消签到
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool CancelQianDao(String id)
        {
            var courseStudentService = new CourseStudentService();
            return courseStudentService.CancelQianDao(id);
        }


        /// <summary>
        /// 根据学校获取所有教师信息
        /// </summary>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<StudentFaceBo> GetAllStudentsBySchoolId(string schoolId)
        {
            var student = new StudentService();

            return student.GetAllStudentsBySchoolId(schoolId);
        }
    }
}
