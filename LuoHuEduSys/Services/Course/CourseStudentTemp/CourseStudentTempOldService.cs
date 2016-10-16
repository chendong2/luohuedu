using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.Course;
using Dapper;
using Domain.common;
using Huatong.DAO;
using Services.Admin.StudentControl;

namespace Services.Course.CourseStudentTemp
{
    public class CourseStudentTempOldService
    {
        /// <summary>
        /// 获取通过excle导入的老数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="rows"></param>
        /// <param name="order"></param>
        /// <param name="sort"></param>
        /// <param name="courseStudentTempBo"></param>
        /// <returns></returns>
        public Page<CourseStudentTempBo> GetCourseStudent(int page, int rows, string order, string sort, CourseStudentTempBo courseStudentTempBo)
        {
            int count = 0;
            int pageIndex = 0;
            int pageSize = 0;
            if (page < 0)
            {
                pageIndex = 0;
            }
            else
            {
                pageIndex = (page - 1) * rows;
            }
            pageSize = page * rows;
            var pageList = new Page<CourseStudentTempBo>();

            string sql = @"SELECT
                          `Id`,
                          `Name`,
                          `IDNO`,
                          `YearNo`,
                          `TermNo`,
                          `CourseType`,
                          `CourseName`,
                          `StudyType`,
                          `Period`,
                          `StartDate`,
                          `EndDate`,
                          `TrainDept`
                        FROM `tb_coursestudenttempold` WHERE 1=1 ";

           
            //sql 查询条件拼接

            if (courseStudentTempBo != null)
            {
                if (!string.IsNullOrEmpty(courseStudentTempBo.CourseName))
                {
                    sql += "and CourseName Like @CourseName ";
                  
                }
                if (!string.IsNullOrEmpty(courseStudentTempBo.Name))
                {
                    sql += "and Name Like @Name ";
                   
                }
                if (!string.IsNullOrEmpty(courseStudentTempBo.IDNO))
                {
                    sql += "and IDNO = @IDNO ";

                }
            }
            string orderby = " ORDER BY CourseName,StartDate " + order;
            //加where条件
            sql += orderby;
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    count = context.Query<CourseStudentTempBo>(sql,
                                             new
                                             {
                                                 CourseName = string.Format("%{0}%", courseStudentTempBo.CourseName),
                                                 Name = string.Format("%{0}%", courseStudentTempBo.Name),
                                                 IDNO =courseStudentTempBo.IDNO
                                             }).Count();
           
                    sql += " limit @pageindex,@pagesize";

                    var list = context.Query<CourseStudentTempBo>(sql,
                                               new
                                               {
                                                   CourseName = string.Format("%{0}%", courseStudentTempBo.CourseName),
                                                   Name = string.Format("%{0}%", courseStudentTempBo.Name),
                                                   IDNO = courseStudentTempBo.IDNO,
                                                   pageindex = pageIndex,
                                                   pagesize = pageSize
                                               }).ToList();

                    pageList.ListT = list;
                    pageList.PageIndex = page;
                    pageList.PageSize = rows;
                    pageList.TotalCount = count;
                    return pageList;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentTempService.GetCourseStudent(courseStudentTempBo)"), ex);
                return pageList;
            }


        }


        /// <summary>
        /// 获取通过excle导入的老数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="rows"></param>
        /// <param name="order"></param>
        /// <param name="sort"></param>
        /// <param name="courseStudentTempBo"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Page<CourseStudentTempBo> GetCourseStudentSingle(int page, int rows, string order, string sort, CourseStudentTempBo courseStudentTempBo,string userId)
        {
            int count = 0;
            int pageIndex = 0;
            int pageSize = 0;
            if (page < 0)
            {
                pageIndex = 0;
            }
            else
            {
                pageIndex = (page - 1) * rows;
            }
            pageSize = page * rows;
            var pageList = new Page<CourseStudentTempBo>();

            var studentService = new StudentService();
            var studentBo = studentService.GetAllStudentById(userId);
            courseStudentTempBo.IDNO = studentBo.IDNo;

            string sql = @"SELECT
                          `Id`,
                          `Name`,
                          `IDNO`,
                          `YearNo`,
                          `TermNo`,
                          `CourseType`,
                          `CourseName`,
                          `StudyType`,
                          `Period`,
                          `StartDate`,
                          `EndDate`,
                          `TrainDept`
                        FROM `tb_coursestudenttempold` WHERE 1=1 ";


            //sql 查询条件拼接

            if (courseStudentTempBo != null)
            {
                if (!string.IsNullOrEmpty(courseStudentTempBo.CourseName))
                {
                    sql += "and CourseName Like @CourseName ";

                }
                if (!string.IsNullOrEmpty(courseStudentTempBo.Name))
                {
                    sql += "and Name Like @Name ";

                }
                if (!string.IsNullOrEmpty(courseStudentTempBo.IDNO))
                {
                    sql += "and IDNO = @IDNO ";

                }
            }
            string orderby = " ORDER BY CourseName,StartDate " + order;
            //加where条件
            sql += orderby;
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    count = context.Query<CourseStudentTempBo>(sql,
                                             new
                                             {
                                                 CourseName = string.Format("%{0}%", courseStudentTempBo.CourseName),
                                                 Name = string.Format("%{0}%", courseStudentTempBo.Name),
                                                 IDNO = courseStudentTempBo.IDNO
                                             }).Count();

                    sql += " limit @pageindex,@pagesize";

                    var list = context.Query<CourseStudentTempBo>(sql,
                                               new
                                               {
                                                   CourseName = string.Format("%{0}%", courseStudentTempBo.CourseName),
                                                   Name = string.Format("%{0}%", courseStudentTempBo.Name),
                                                   IDNO = courseStudentTempBo.IDNO,
                                                   pageindex = pageIndex,
                                                   pagesize = pageSize
                                               }).ToList();

                    pageList.ListT = list;
                    pageList.PageIndex = page;
                    pageList.PageSize = rows;
                    pageList.TotalCount = count;
                    return pageList;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentTempService.GetCourseStudent(courseStudentTempBo)"), ex);
                return pageList;
            }


        }


        /// <summary>
        /// 批量数据导入方法
        /// </summary>
        /// <param name="courseStudentTempBo"></param>
        /// <returns></returns>
        public bool AddCourseStudentTempOld(CourseStudentTempOldBo courseStudentTempBo)
        {
            if (courseStudentTempBo == null)
                throw new ArgumentNullException("courseStudentTempBo");
            if (courseStudentTempBo.Id != null && courseStudentTempBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String id = Guid.NewGuid().ToString();
                    var sqlStr = @"INSERT INTO `tb_coursestudenttempold`
                                    (`Id`,
                                     `Name`,
                                     `IDNO`,
                                     `YearNo`,
                                     `TermNo`,
                                     `CourseType`,
                                     `CourseName`,
                                     `StudyType`,
                                     `Period`,
                                     `StartDate`,
                                     `EndDate`,
                                     `TrainDept`
                                    )
                        VALUES (@Id,
                                @Name,
                                @IDNO,
                                @YearNo,
                                @TermNo,
                                @CourseType,
                                @CourseName,
                                @StudyType,
                                @Period,
                                @StartDate,
                                @EndDate,
                                @TrainDept
                                );";
                    int row = connection.Execute(sqlStr, courseStudentTempBo);
                    if (row > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }

            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.AddStudent({0})异常", courseStudentTempBo), ex);
                return false;
            }
        }
    }
}
