﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.Course;
using BusinessObject.WSBo;
using Services.Course.AttendanceReport;
using Services.Course.CourseControl;
using Services.Course.CourseStudentTemp;
using Services.Parameter;

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
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetRoleCourseList(int page, int rows, string order, string sort, CourseBo courseBo)
        {
            var courseService = new CourseService();
            var list = courseService.GetRoleCourseList(page, rows, sort, order, courseBo);
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
        /// 根据学员ID获取学员报名的课程数据信息
        /// </summary>
        /// <param name="page"></param>
        /// <param name="rows"></param>
        /// <param name="order"></param>
        /// <param name="sort"></param>
        /// <param name="courseBo"></param>
        /// <param name="studentId"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetMyCourseList(int page, int rows, string order, string sort, CourseBo courseBo,
            string studentId)
        {
            var courseService = new CourseService();
            var list = courseService.GetMyCourseList(page, rows, sort, order, courseBo,studentId);
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
            courseBo.Locked = 2;

            var courseService = new CourseService();
            return courseService.AddCourse(courseBo);
        }
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteCousrseByIds(string ids)
        {
            var courseService = new CourseService();
            return courseService.DeleteCousrseByIds(ids);
        }


        /// <summary>
        /// 校本培训课程新增方法
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddCourseXiaoBen(CourseBo courseBo)
        {

            var school=new SchoolService();

            courseBo.Requirement =0;
            courseBo.CourseState = 2;
            courseBo.AduitTime = DateTime.Now;
            courseBo.Locked = 2;//新增默认未锁定
            var schoolbo=school.GetSchoolById(courseBo.SchoolId);
            //给权限默认赋值，表示只有该学校可以报名
            if (schoolbo != null)
            {

                if (schoolbo.SchoolType=="1")
                {
                    courseBo.PlcSchool = courseBo.SchoolId;
                }
                if (schoolbo.SchoolType == "2")
                {
                    courseBo.PriSchool = courseBo.SchoolId;
                }
                courseBo.OrganizationalName = courseBo.SchoolId;//组织单位默认赋值为学校管理员所在的单位
            }

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
        /// <summary>
        /// 课程审核方法
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AduitSet(CourseBo courseBo)
        {
            var courseService = new CourseService();
            return courseService.AduitSet(courseBo);
        }

        /// <summary>
        /// 根据课程ID获取报名数据
        /// </summary>
        /// <param name="courseId"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetCourseStudentByCourseId(int page, int rows, string order, string sort, string courseId)
        {
            var courseStudent = new CourseStudentFace();
            var list = courseStudent.GetCourseStudentByCourseIdNew(page,rows,order,sort, courseId);
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


        #region "删除报名学员信息"

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteCourseStudent(String ids)
        {
            var courseStudent = new CourseStudentService();
            return courseStudent.DeleteCourseStudent(ids);
        }
        /// <summary>
        /// 批量新增报名数据
        /// </summary>
        /// <param name="studentBo"></param>
        /// <param name="ids"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool BatchAddCourseStudent(CourseStudentDto studentBo, string ids)
        {
            var courseStudent = new CourseStudentService();
            return courseStudent.BatchAddCourseStudent(studentBo, ids);
        }
        #endregion


        #region "历史数据查询处理方法汇总"

        /// <summary>
        /// 获取历史考勤数据（excel导入）
        /// </summary>
        /// <param name="page"></param>
        /// <param name="rows"></param>
        /// <param name="order"></param>
        /// <param name="sort"></param>
        /// <param name="courseStudentTempBo"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetCourseStudent(int page, int rows, string order, string sort,
            CourseStudentTempBo courseStudentTempBo)
        {
            var courseStudent = new CourseStudentTempService();
            var list = courseStudent.GetCourseStudent(page, rows, order, sort, courseStudentTempBo);
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

        #endregion


        //获取新的考勤管理数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetCourseStudentNew(int page, int rows, string order, string sort,
            AttendanceReportBo attendanceReportBo)
        {
            var aPService = new AttendanceReportService();
            var list = aPService.GetAttendanceReportList(page, rows, order, sort, attendanceReportBo);
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


        //老系统数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetCourseStudentOld(int page, int rows, string order, string sort,
            CourseStudentTempBo courseStudentTemp)
        {
            var aPService = new CourseStudentTempOldService();
            var list = aPService.GetCourseStudent(page, rows, order, sort, courseStudentTemp);
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



        //根据ID获取考勤数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public CourseStudentDto GetCourseStudentById(string id)
        {
            var courseStudentService = new CourseStudentService();
            return courseStudentService.GetCourseStudentById(id);
        }

        /// <summary>
        /// 修改学生学时
        /// </summary>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdatePeroid(CourseStudentDto courseStudentBo)
        {
            var courseStudentService = new CourseStudentService();
            return courseStudentService.UpdatePeroid(courseStudentBo);
        }

        /// <summary>
        /// 锁定课程
        /// </summary>
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool SetLockCourse(CourseBo courseBo)
        {
            var course = new CourseService();
            return course.SetLockCourse(courseBo);
        }
    }
}
