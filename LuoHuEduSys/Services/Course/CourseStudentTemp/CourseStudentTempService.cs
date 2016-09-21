using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.Course;
using Dapper;
using Domain.common;
using Huatong.DAO;

namespace Services.Course.CourseStudentTemp
{
    public class CourseStudentTempService
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

            string sql = @"SELECT * FROM  tb_coursestudenttemp WHERE 1=1 ";

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
            }
            string orderby = " ORDER BY CourseName,StartDate " +order;
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
                                                 Name = string.Format("%{0}%", courseStudentTempBo.Name)
                                             }).Count();

                    sql += " limit @pageindex,@pagesize";

                    var list = context.Query<CourseStudentTempBo>(sql,
                                               new
                                               {
                                                   CourseName = string.Format("%{0}%", courseStudentTempBo.CourseName),
                                                   Name = string.Format("%{0}%", courseStudentTempBo.Name),
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
    }
}
